import pandas as pd
import xgboost as xgb
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

def train_model():
    data_path = 'backend/ml_pipeline/data/synthetic_dyslexia_data.csv'
    if not os.path.exists(data_path):
        print(f"Data not found at {data_path}. Run data_gen.py first.")
        return
        
    df = pd.read_csv(data_path)
    
    # Define features and target
    X = df.drop(columns=['risk_level'])
    y = df['risk_level']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training XGBoost Multi-Class Classifier...")
    # risk_level: 0=low, 1=moderate, 2=high
    model = xgb.XGBClassifier(
        objective='multi:softprob',
        num_class=3,
        n_estimators=100,
        learning_rate=0.1,
        max_depth=4,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Low Risk', 'Moderate Risk', 'High Risk']))
    
    os.makedirs('backend/ml_model', exist_ok=True)
    model_file = 'backend/ml_model/model.pkl'
    with open(model_file, 'wb') as f:
        pickle.dump(model, f)
        
    print(f"Model saved successfully to {model_file}")

if __name__ == '__main__':
    train_model()
