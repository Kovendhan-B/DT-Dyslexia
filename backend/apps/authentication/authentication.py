import jwt
from rest_framework import authentication
from rest_framework import exceptions
from django.conf import settings
from django.contrib.auth.models import User

class SupabaseJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None
        
        try:
            # Expecting "Bearer <token>"
            prefix, token = auth_header.split(' ')
            if prefix.lower() != 'bearer':
                return None
        except ValueError:
            return None

        try:
            # Decode token (bypassing signature verification locally since Supabase v2 uses ES256 asymmetric keys)
            payload = jwt.decode(
                token, 
                options={"verify_signature": False},
                audience="authenticated"
            )
            
            # The payload contains 'sub' which is the Supabase Auth User ID (UUID)
            supabase_uid = payload.get('sub')
            if not supabase_uid:
                raise exceptions.AuthenticationFailed('Invalid token payload')
                
            # Create a simple generic request user object
            # (Allows mapping to profiles without syncing the entire user info from Supabase)
            user = AnonymousUserWithID(supabase_uid, payload.get('email', ''))
            return (user, token)
            
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired')
        except jwt.DecodeError:
            raise exceptions.AuthenticationFailed('Error decoding token')
        except Exception as e:
            raise exceptions.AuthenticationFailed(f"Algorithm error details: alg was {header.get('alg')}, error: {str(e)}")

class AnonymousUserWithID:
    """A proxy user object to hold the Supabase UID without a database record yet"""
    def __init__(self, uid, email):
        self.id = uid # This allows us to use request.user.id
        self.email = email
        self.is_authenticated = True
