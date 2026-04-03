import requests
from typing import Optional


class MedicineDBManager:
    def __init__(self):
        self.base_url = "https://api.fda.gov/drug/label.json"

    def search_medicine(self, name: str) -> Optional[dict]:
        """
        Search OpenFDA for drug label data.
        Tries multiple query strategies to maximise hit rate.
        """
        name_lower = name.lower().strip()
        strategies = [
            # Strategy 1: exact generic name match
            f'openfda.generic_name:"{name_lower}"',
            # Strategy 2: exact brand name match
            f'openfda.brand_name:"{name_lower}"',
            # Strategy 3: wildcard generic name
            f'openfda.generic_name:{name_lower}*',
            # Strategy 4: wildcard brand name
            f'openfda.brand_name:{name_lower}*',
            # Strategy 5: substance name
            f'openfda.substance_name:"{name_lower}"',
        ]

        for query in strategies:
            try:
                response = requests.get(
                    self.base_url,
                    params={"search": query, "limit": 1},
                    timeout=8,
                )
                if response.status_code == 200:
                    data = response.json()
                    results = data.get("results", [])
                    if results:
                        return self._parse_result(results[0], name)
            except Exception as e:
                print(f"OpenFDA strategy '{query}' failed: {e}")
                continue

        return None

    def _parse_result(self, res: dict, fallback_name: str) -> dict:
        openfda = res.get("openfda", {})
        brand_names = openfda.get("brand_name", [])
        generic_names = openfda.get("generic_name", [])

        display_name = brand_names[0] if brand_names else (generic_names[0] if generic_names else fallback_name.capitalize())

        def first(field: str, default: str = "Information not available") -> str:
            val = res.get(field, [default])
            return val[0][:1500] if val else default  # Truncate very long FDA text

        return {
            "name": display_name,
            "category": openfda.get("product_type", [""])[0] if openfda.get("product_type") else "",
            "purpose": first("indications_and_usage"),
            "dosage": first("dosage_and_administration", "Refer to doctor or pharmacist instructions."),
            "side_effects": first("adverse_reactions", "Consult medical literature for adverse reactions."),
            "warnings": first("warnings", "Standard precautions apply. Consult your doctor."),
            "precautions": first("precautions", ""),
        }


medicine_db_manager = MedicineDBManager()
