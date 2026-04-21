import pandas as pd
import numpy as np
import os
import random

def generate_synthetic_data(num_samples=1000):
    """
    Generates synthetic learner progress data based on heuristics
    to bootstrap the XGBoost model.
    """
    np.random.seed(42)
    random.seed(42)

    data = []
    
    for _ in range(num_samples):
        # We will generate two distinct group profiles to help the model learn
        # Profile 0: Lower risk profile
        # Profile 1: Higher risk profile
        # We also add noise to these.
        
        is_high_risk = random.random() < 0.35 # 35% high risk in our synthetic data
        
        if is_high_risk:
            phonics = np.clip(np.random.normal(45, 15), 0, 100)
            reading = np.clip(np.random.normal(40, 15), 0, 100)
            alphabet = np.clip(np.random.normal(55, 15), 0, 100)
            sightwords = np.clip(np.random.normal(40, 15), 0, 100)
            wordbuilding = np.clip(np.random.normal(35, 15), 0, 100)
            
            game_completion = np.clip(np.random.normal(0.4, 0.2), 0.0, 1.0)
            streak = max(0, int(np.random.normal(2, 2)))
            session_count_7d = max(0, int(np.random.normal(3, 2)))
            avg_session_gap = np.clip(np.random.normal(3.5, 1.5), 1.0, 14.0)
            unlocked_alpha_pct = np.clip(np.random.normal(0.5, 0.2), 0.0, 1.0)
            
            # 2 = High risk, 1 = Moderate risk
            risk_level = 2 if random.random() < 0.7 else 1
            
        else:
            phonics = np.clip(np.random.normal(85, 10), 0, 100)
            reading = np.clip(np.random.normal(80, 10), 0, 100)
            alphabet = np.clip(np.random.normal(90, 8), 0, 100)
            sightwords = np.clip(np.random.normal(75, 15), 0, 100)
            wordbuilding = np.clip(np.random.normal(70, 15), 0, 100)
            
            game_completion = np.clip(np.random.normal(0.8, 0.15), 0.0, 1.0)
            streak = max(0, int(np.random.normal(10, 5)))
            session_count_7d = max(0, int(np.random.normal(6, 1)))
            avg_session_gap = np.clip(np.random.normal(1.2, 0.5), 1.0, 14.0)
            unlocked_alpha_pct = np.clip(np.random.normal(0.9, 0.1), 0.0, 1.0)
            
            # 0 = Low risk, 1 = Moderate risk
            risk_level = 0 if random.random() < 0.8 else 1

        # Add noise to blur boundaries
        phonics += np.random.normal(0, 5)
        reading += np.random.normal(0, 5)
        
        row = {
            'phonics_score': phonics,
            'reading_score': reading,
            'alphabet_score': alphabet,
            'sightwords_score': sightwords,
            'wordbuilding_score': wordbuilding,
            'game_completion_rate': game_completion,
            'streak_count': streak,
            'session_count_7d': session_count_7d,
            'avg_session_gap_days': avg_session_gap,
            'unlocked_alpha_pct': unlocked_alpha_pct,
            'risk_level': risk_level
        }
        data.append(row)
        
    df = pd.DataFrame(data)
    
    os.makedirs('backend/ml_pipeline/data', exist_ok=True)
    df.to_csv('backend/ml_pipeline/data/synthetic_dyslexia_data.csv', index=False)
    print(f"Generated {num_samples} synthetic rows at backend/ml_pipeline/data/synthetic_dyslexia_data.csv")

if __name__ == '__main__':
    generate_synthetic_data(1500)
