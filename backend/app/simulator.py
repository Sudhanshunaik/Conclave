import math
from typing import List
from app.models import Coordinates, Task
from app.database import db

# Realistic intermediate GPS waypoints between Panaji and GMC Bambolim along NH66 (Goa)
PANAJI_TO_GMC_WAYPOINTS: List[Coordinates] = [
    Coordinates(lat=15.4989, lng=73.8278), # Panaji KTC
    Coordinates(lat=15.4912, lng=73.8320), # Patto Plaza / Ourem Creek
    Coordinates(lat=15.4840, lng=73.8395), # Ribandar Bypass Junction
    Coordinates(lat=15.4760, lng=73.8450), # Merces Junction
    Coordinates(lat=15.4690, lng=73.8510), # Santa Cruz / Bambolim approach
    Coordinates(lat=15.4640, lng=73.8545), # GMC Circle
    Coordinates(lat=15.4616, lng=73.8567), # GMC Main OPD Entrance
]

def generate_interpolated_waypoints(start: Coordinates, end: Coordinates, steps: int = 6) -> List[Coordinates]:
    """Generates linear intermediate waypoints between any two coordinates."""
    points = []
    for i in range(steps + 1):
        ratio = i / steps
        lat = start.lat + (end.lat - start.lat) * ratio
        lng = start.lng + (end.lng - start.lng) * ratio
        points.append(Coordinates(lat=round(lat, 6), lng=round(lng, 6)))
    return points


def advance_task_simulation(task: Task, step_index: int) -> Task:
    """
    Advances a task's simulation state.
    step 0: requested
    step 1: matched with Rahul Naik
    step 2: in_progress (waypoint 2)
    step 3: in_progress (waypoint 4)
    step 4: arrived at pickup/destination (waypoint 6)
    step 5: completed (triggers coin payment)
    """
    if step_index == 1:
        # Assign best available helper
        best_helper = db.get_helper("helper_rahul_01") or db.get_all_helpers()[0]
        db.update_task_status(task.id, "matched", best_helper.id)
        db.update_helper_coords(best_helper.id, PANAJI_TO_GMC_WAYPOINTS[0])
    elif step_index == 2:
        db.update_task_status(task.id, "in_progress", task.helper_id)
        if task.helper_id:
            db.update_helper_coords(task.helper_id, PANAJI_TO_GMC_WAYPOINTS[2])
    elif step_index == 3:
        db.update_task_status(task.id, "in_progress", task.helper_id)
        if task.helper_id:
            db.update_helper_coords(task.helper_id, PANAJI_TO_GMC_WAYPOINTS[4])
    elif step_index == 4:
        db.update_task_status(task.id, "arrived", task.helper_id)
        if task.helper_id:
            db.update_helper_coords(task.helper_id, PANAJI_TO_GMC_WAYPOINTS[6])
    elif step_index >= 5:
        db.update_task_status(task.id, "completed", task.helper_id)

    return db.get_task(task.id)
