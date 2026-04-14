import json
import re
from explorecourses import CourseConnection

connect = CourseConnection()
YEAR = "2025-2026"

# Only treat these as “real classes”
VALID_COMPONENTS = {"LEC", "SEM", "ACT"}


# ─────────────────────────────
# Prerequisite extraction
# ─────────────────────────────
def extract_prereqs(description):
    if not description:
        return []

    match = re.search(
        r'(Prerequisite[s]?|Firm requisites?):\s*(.*?)(\.|\n)',
        description,
        re.IGNORECASE
    )

    if not match:
        return []

    text = match.group(2)
    courses = re.findall(r'[A-Z]{2,}\s?\d+[A-Z]?', text)

    return sorted(set(courses))


# ─────────────────────────────
# Extract schedule (THIS is the key part)
# ─────────────────────────────
def extract_schedules(section):
    schedules = []

    for s in getattr(section, "schedules", []):
        schedules.append({
            "days": getattr(s, "days", None),
            "start_time": getattr(s, "start_time", None),
            "end_time": getattr(s, "end_time", None),
            "start_date": getattr(s, "start_date", None),
            "end_date": getattr(s, "end_date", None),
            "location": getattr(s, "location", None),
        })

    return schedules


# ─────────────────────────────
# Main builder
# ─────────────────────────────
def run():
    print("Fetching schools...")
    schools = connect.get_schools(YEAR)

    all_courses = []
    seen = set()

    print("Processing departments...")

    for school in schools:
        for dept in school.departments:
            try:
                courses = connect.get_courses_by_department(dept.code, year=YEAR)

                for c in courses:
                    course_code = f"{c.subject} {c.code}"

                    if course_code in seen:
                        continue
                    seen.add(course_code)

                    sections_cleaned = []

                    for sec in getattr(c, "sections", []):
                        # Ignore discussion/lab sections
                        if sec.component not in VALID_COMPONENTS:
                            continue

                        sections_cleaned.append({
                            "component": sec.component,
                            "section_num": sec.section_num,
                            "term": sec.term,   # 🔥 IMPORTANT: term per section

                            "units": getattr(sec, "units", None),

                            # enrollment info (useful for planning)
                            "enrolled": getattr(sec, "curr_class_size", None),
                            "capacity": getattr(sec, "max_class_size", None),

                            # 🔥 FINAL TIME DATA
                            "schedule": extract_schedules(sec)
                        })

                    all_courses.append({
                        "code": course_code,
                        "title": c.title,
                        "subject": c.subject,
                        "description": c.description,

                        "units_min": c.units_min,
                        "units_max": c.units_max,

                        "year": c.year,
                        "prereqs": extract_prereqs(c.description),

                        # 🔥 EVERYTHING YOU NEED FOR PLANNING
                        "sections": sections_cleaned
                    })

                print(f"✓ {dept.code}")

            except Exception as e:
                print(f"✗ {dept.code}: {e}")

    print("\nTotal courses:", len(all_courses))

    with open("stanford_courses_2025-2026.json", "w", encoding="utf-8") as f:
        json.dump(all_courses, f, indent=2)


if __name__ == "__main__":
    run()