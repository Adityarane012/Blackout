from typing import List, Dict, Any

class ScenarioService:
    """
    Manages predefined and custom failure stress scenarios.
    """
    
    def get_all_scenarios(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "black_friday_traffic",
                "name": "Black Friday Traffic Spike",
                "description": "Simulates a massive 10x influx of requests hitting all frontend nodes simultaneously."
            },
            {
                "id": "retry_storm",
                "name": "Retry Storm",
                "description": "Upstream services repeatedly retry failed API calls, compounding load."
            },
            {
                "id": "database_saturation",
                "name": "Database Saturation",
                "description": "Primary database CPU hits 100%, causing locking and cascading timeouts."
            },
            {
                "id": "queue_congestion",
                "name": "Queue Congestion",
                "description": "Message brokers fail to process events, causing backpressure on services."
            },
            {
                "id": "api_failure",
                "name": "External API Failure",
                "description": "A 3rd-party API begins returning 500s or timing out."
            },
            {
                "id": "custom_node_failure",
                "name": "Custom Node Failure",
                "description": "A specifically targeted node goes completely offline."
            }
        ]

    def get_scenario_trigger(self, scenario_id: str, target_node_id: str = None) -> Dict[str, Any]:
        """
        Returns the initial failure injection payload for the Simulation Engine.
        """
        base_trigger = {
            "scenario": scenario_id,
            "target": target_node_id,
            "initial_state": "FAILED",
            "initial_load": 100
        }
        
        if scenario_id == "black_friday_traffic":
            base_trigger["initial_state"] = "STRESSED"
            base_trigger["initial_load"] = 95
        
        return base_trigger
