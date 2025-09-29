from typing import Dict
from datetime import datetime
from pathlib import Path
import json
from bugs.settings import BACKUP_FOLDER

class WorldBackupSaver():

    def save_backup(self, world_data: Dict):
        keep_last_n = 3
        path = Path(BACKUP_FOLDER)
        path.mkdir(exist_ok=True)

        timestamp = int(datetime.now().timestamp())
        filename = path / f"{timestamp}.json"

        with open(filename, "w") as f:
            json.dump(world_data, f)

        snapshots = sorted(
            path.glob("*.json"),
            key=lambda f: int(f.stem),
            reverse=True
        )

        for old_file in snapshots[keep_last_n:]:
            old_file.unlink()