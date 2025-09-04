#include <iostream>
#include <vector>
#include <queue>
#include <map>
#include <string>
#include <memory>
#include <algorithm>
#include <iomanip>
#include <ctime>
#include <cstdlib>

using namespace std;

// Room class to represent hostel rooms - SIMPLIFIED WITHOUT FEATURES
class Room {
public:
    string roomId;
    string type; // Single, Double, Triple
    int capacity;
    int currentOccupancy;
    int floor;
    string building;
    bool isAvailable;

    Room(string id, string roomType, int cap, int occ, int fl, string bld)
        : roomId(id), type(roomType), capacity(cap), currentOccupancy(occ),
          floor(fl), building(bld) {
        isAvailable = (currentOccupancy < capacity);
    }

    bool hasSpace() const {
        return currentOccupancy < capacity;
    }

    void allocateSpace() {
        if (hasSpace()) {
            currentOccupancy++;
            isAvailable = (currentOccupancy < capacity);
        }
    }

    void displayRoom() const {
        cout << "Room " << roomId << " (" << type << ") - "
             << currentOccupancy << "/" << capacity << " occupied";
        cout << " [Floor: " << floor << ", Building: " << building << "]" << endl;
    }
};

// Student class to represent student applications
class Student {
public:
    string name;
    string studentId;
    double gpa;
    string specialPriority;
    vector<string> preferences;
    double priorityScore;
    long timestamp;
    string allocatedRoom;
    bool isAllocated;

    Student(string n, string id, double g, string sp, vector<string> pref)
        : name(n), studentId(id), gpa(g), specialPriority(sp), preferences(pref),
          allocatedRoom(""), isAllocated(false) {
        timestamp = time(nullptr) + rand() % 3600; // Simulate different submission times
        calculatePriorityScore();
    }

private:
    void calculatePriorityScore() {
        // Priority score formula for MAX HEAP: Higher score = higher priority
        double specialMultiplier = getSpecialPriorityMultiplier();
        double basePriority = 1000.0;
        double gpaBonus = gpa * 100.0;
        double timestampBonus = (timestamp % 3600) * 0.01; // Small time-based bonus

        // For max heap: ADD bonuses instead of subtracting
        priorityScore = (basePriority * specialMultiplier) + gpaBonus + timestampBonus;
    }

    double getSpecialPriorityMultiplier() {
        // Higher multipliers for max heap (higher priority)
        if (specialPriority == "Medical") return 2.0;
        if (specialPriority == "Sports") return 1.5;
        if (specialPriority == "Academic") return 1.8;
        if (specialPriority == "Financial") return 1.3;
        return 1.0; // None
    }

public:
    void displayStudent() const {
        cout << "Student: " << name << " (ID: " << studentId << ")" << endl;
        cout << "  GPA: " << fixed << setprecision(2) << gpa << endl;
        cout << "  Special Priority: " << specialPriority << endl;
        cout << "  Priority Score: " << fixed << setprecision(2) << priorityScore << endl;
        cout << "  Preferences: ";
        for (size_t i = 0; i < preferences.size(); ++i) {
            cout << preferences[i];
            if (i < preferences.size() - 1) cout << " > ";
        }
        cout << endl;
        if (isAllocated) {
            cout << "  ✓ Allocated to Room: " << allocatedRoom << endl;
        } else {
            cout << "  ✗ Not allocated" << endl;
        }
        cout << endl;
    }
};

// Comparator for MAX-HEAP (priority queue)
struct StudentComparator {
    bool operator()(const shared_ptr<Student>& a, const shared_ptr<Student>& b) {
        // Max-heap: return true if a has LOWER priority than b
        if (abs(a->priorityScore - b->priorityScore) < 0.001) {
            // If priority scores are equal, use timestamp (earlier submission has priority)
            return a->timestamp > b->timestamp;
        }
        // For MAX heap: return true if a's score is LESS than b's score
        return a->priorityScore < b->priorityScore;
    }
};

// Hostel Management System
class HostelAllocationSystem {
private:
    map<string, shared_ptr<Room>> rooms;
    priority_queue<shared_ptr<Student>, vector<shared_ptr<Student>>, StudentComparator> studentHeap;
    vector<shared_ptr<Student>> allStudents;
    vector<shared_ptr<Student>> allocatedStudents;
    vector<shared_ptr<Student>> waitlistStudents;

public:
    HostelAllocationSystem() {
        initializeRooms();
        initializeSampleStudents();
    }

private:
    void initializeRooms() {
        // Initialize sample rooms - SIMPLIFIED WITHOUT FEATURES
        vector<shared_ptr<Room>> roomList = {
            make_shared<Room>("A101", "Single", 1, 0, 1, "A"),
            make_shared<Room>("A102", "Double", 2, 0, 1, "A"),
            make_shared<Room>("A103", "Triple", 3, 1, 1, "A"),
            make_shared<Room>("A201", "Single", 1, 1, 2, "A"),
            make_shared<Room>("A202", "Double", 2, 0, 2, "A"),
            make_shared<Room>("B101", "Double", 2, 1, 1, "B"),
            make_shared<Room>("B102", "Triple", 3, 0, 1, "B"),
            make_shared<Room>("B201", "Single", 1, 0, 2, "B"),
            make_shared<Room>("B202", "Double", 2, 2, 2, "B"),
            make_shared<Room>("C101", "Triple", 3, 0, 1, "C"),
            make_shared<Room>("C102", "Single", 1, 0, 1, "C"),
            make_shared<Room>("C201", "Double", 2, 0, 2, "C"),
            make_shared<Room>("D101", "Single", 1, 0, 1, "D"),
            make_shared<Room>("D102", "Double", 2, 1, 1, "D"),
            make_shared<Room>("E101", "Double", 2, 0, 1, "E")
        };

        for (auto room : roomList) {
            rooms[room->roomId] = room;
        }
    }

    void initializeSampleStudents() {
        // Sample students with REASONABLE VALUES
        vector<shared_ptr<Student>> students = {
            make_shared<Student>("Alice Green", "CS2024001", 4.0, "Academic", vector<string>{"A101", "B201", "D101"}),
            make_shared<Student>("Bob Johnson", "CS2024002", 3.6, "None", vector<string>{"A202", "C201", "E101"}),
            make_shared<Student>("Maya Patel", "CS2024003", 3.8, "Sports", vector<string>{"B102", "C101", "B101"}),
            make_shared<Student>("Carlos Rodriguez", "CS2024004", 2.9, "Medical", vector<string>{"A101", "B201", "C102"}),
            make_shared<Student>("Sophia Kim", "CS2024005", 3.3, "Financial", vector<string>{"A103", "B101", "C201"}),
            make_shared<Student>("James Wilson", "CS2024006", 3.4, "None", vector<string>{"D102", "A202", "E101"}),
            make_shared<Student>("Emma Davis", "CS2024007", 3.7, "Academic", vector<string>{"C102", "D101", "B201"}),
            make_shared<Student>("Alex Chen", "CS2024008", 3.1, "Sports", vector<string>{"C101", "B102", "A202"}),
            make_shared<Student>("Isabella Martinez", "CS2024009", 3.5, "None", vector<string>{"E101", "C201", "A202"}),
            make_shared<Student>("Noah Thompson", "CS2024010", 3.2, "Medical", vector<string>{"A101", "C102", "D101"})
        };

        for (auto student : students) {
            allStudents.push_back(student);
            studentHeap.push(student);
        }
    }

public:
    void displayRoomAvailability() {
        cout << "\n" << string(60, '=') << endl;
        cout << "           ROOM AVAILABILITY STATUS" << endl;
        cout << string(60, '=') << endl;
        for (auto& pair : rooms) {
            auto room = pair.second;
            cout << "Room " << room->roomId << " (" << setw(6) << room->type << ") - ";
            cout << room->currentOccupancy << "/" << room->capacity << " occupied";
            if (room->hasSpace()) {
                cout << " [AVAILABLE]";
            } else {
                cout << " [FULL]     ";
            }
            cout << " - Floor: " << room->floor << ", Building: " << room->building << endl;
        }
        cout << endl;
    }

    void displayStudentApplications() {
        cout << string(60, '=') << endl;
        cout << "  STUDENT APPLICATIONS (MAX HEAP - Highest Priority First)" << endl;
        cout << string(60, '=') << endl;

        // Create a copy of the heap to display without modifying original
        auto tempHeap = studentHeap;
        int rank = 1;

        while (!tempHeap.empty()) {
            auto student = tempHeap.top();
            tempHeap.pop();
            cout << "Rank " << rank++ << ": " << student->name
                 << " (Priority Score: " << fixed << setprecision(2)
                 << student->priorityScore << ")" << endl;
            cout << "  ID: " << student->studentId
                 << " | GPA: " << student->gpa
                 << " | Special: " << student->specialPriority << endl;
            cout << "  Preferences: ";
            for (size_t i = 0; i < student->preferences.size(); ++i) {
                cout << student->preferences[i];
                if (i < student->preferences.size() - 1) cout << " > ";
            }
            cout << endl << endl;
        }
    }

    void runAllocationAlgorithm() {
        cout << string(60, '=') << endl;
        cout << "    STARTING ROOM ALLOCATION (MAX HEAP)" << endl;
        cout << string(60, '=') << endl;

        allocatedStudents.clear();
        waitlistStudents.clear();

        while (!studentHeap.empty()) {
            auto student = studentHeap.top();
            studentHeap.pop();

            cout << "\nProcessing: " << student->name << " (Priority: "
                 << fixed << setprecision(2) << student->priorityScore << ")" << endl;

            bool allocated = false;

            // Try to allocate based on preferences
            for (const string& roomId : student->preferences) {
                if (rooms.find(roomId) != rooms.end() && rooms[roomId]->hasSpace()) {
                    // Allocate the room
                    rooms[roomId]->allocateSpace();
                    student->allocatedRoom = roomId;
                    student->isAllocated = true;
                    allocatedStudents.push_back(student);
                    allocated = true;
                    cout << "  ✓ Allocated to preferred room: " << roomId << endl;
                    break;
                }
            }

            // If no preferred room available, try any available room
            if (!allocated) {
                for (auto& pair : rooms) {
                    if (pair.second->hasSpace()) {
                        pair.second->allocateSpace();
                        student->allocatedRoom = pair.first;
                        student->isAllocated = true;
                        allocatedStudents.push_back(student);
                        allocated = true;
                        cout << "  ⚠ Allocated to alternative room: " << pair.first << endl;
                        break;
                    }
                }
            }

            // If still not allocated, add to waitlist
            if (!allocated) {
                waitlistStudents.push_back(student);
                cout << "  ✗ Added to waitlist (no rooms available)" << endl;
            }
        }

        cout << "\n" << string(60, '=') << endl;
        cout << "         ALLOCATION COMPLETED" << endl;
        cout << string(60, '=') << endl;
    }

    void displayResults() {
        cout << "\n" << string(60, '=') << endl;
        cout << "           ALLOCATION RESULTS" << endl;
        cout << string(60, '=') << endl;

        cout << "\nSUCCESSFULLY ALLOCATED STUDENTS (" << allocatedStudents.size() << "):" << endl;
        cout << string(40, '-') << endl;
        for (auto student : allocatedStudents) {
            cout << student->name << " → Room " << student->allocatedRoom << endl;
        }

        if (!waitlistStudents.empty()) {
            cout << "\nWAITLIST (" << waitlistStudents.size() << "):" << endl;
            cout << string(40, '-') << endl;
            for (auto student : waitlistStudents) {
                cout << student->name << " (Priority: "
                     << fixed << setprecision(2) << student->priorityScore << ")" << endl;
            }
        }

        // Statistics
        cout << "\n" << string(60, '=') << endl;
        cout << "             STATISTICS" << endl;
        cout << string(60, '=') << endl;

        int totalStudents = allStudents.size();
        int totalAllocated = allocatedStudents.size();
        int totalWaitlist = waitlistStudents.size();

        cout << "Total Applications: " << totalStudents << endl;
        cout << "Successfully Allocated: " << totalAllocated << endl;
        cout << "Waitlisted: " << totalWaitlist << endl;
        cout << "Allocation Success Rate: " << fixed << setprecision(1)
             << (100.0 * totalAllocated / totalStudents) << "%" << endl;

        // Room utilization
        int totalCapacity = 0, totalOccupied = 0;
        for (auto& pair : rooms) {
            totalCapacity += pair.second->capacity;
            totalOccupied += pair.second->currentOccupancy;
        }

        cout << "Room Utilization: " << totalOccupied << "/" << totalCapacity
             << " (" << fixed << setprecision(1) << (100.0 * totalOccupied / totalCapacity)
             << "%)" << endl;
    }

    void addNewStudent() {
        string name, studentId, specialPriority;
        double gpa;
        vector<string> preferences;

        cout << "\n" << string(50, '=') << endl;
        cout << "     ADD NEW STUDENT APPLICATION" << endl;
        cout << string(50, '=') << endl;

        cout << "Enter student name: ";
        cin.ignore();
        getline(cin, name);

        cout << "Enter student ID: ";
        getline(cin, studentId);

        cout << "Enter GPA (0.0-4.0): ";
        cin >> gpa;

        cout << "\nSpecial Priority Options:" << endl;
        cout << "1. None" << endl;
        cout << "2. Medical" << endl;
        cout << "3. Sports" << endl;
        cout << "4. Academic" << endl;
        cout << "5. Financial" << endl;
        cout << "Choose (1-5): ";

        int choice;
        cin >> choice;
        switch (choice) {
            case 2: specialPriority = "Medical"; break;
            case 3: specialPriority = "Sports"; break;
            case 4: specialPriority = "Academic"; break;
            case 5: specialPriority = "Financial"; break;
            default: specialPriority = "None"; break;
        }

        cout << "\nSelect up to 3 room preferences:" << endl;
        displayAvailableRoomsForSelection();
        cout << "Enter room IDs (press enter after each, 'done' to finish): ";

        string roomId;
        while (preferences.size() < 3) {
            cin >> roomId;
            if (roomId == "done") break;
            if (rooms.find(roomId) != rooms.end()) {
                preferences.push_back(roomId);
            } else {
                cout << "Invalid room ID. Try again: ";
            }
        }

        auto newStudent = make_shared<Student>(name, studentId, gpa, specialPriority, preferences);
        allStudents.push_back(newStudent);
        studentHeap.push(newStudent);

        cout << "\nStudent added successfully!" << endl;
        cout << "Priority Score: " << fixed << setprecision(2) << newStudent->priorityScore << endl;
    }

    void displayAvailableRoomsForSelection() {
        cout << "Available Rooms:" << endl;
        for (auto& pair : rooms) {
            if (pair.second->hasSpace()) {
                cout << "  " << pair.first << " (" << pair.second->type << ")"
                     << " - Floor " << pair.second->floor 
                     << ", Building " << pair.second->building << endl;
            }
        }
    }

    void displayMenu() {
        cout << "\n" << string(60, '=') << endl;
        cout << "      HOSTEL ROOM ALLOCATION SYSTEM" << endl;
        cout << "      (MAX HEAP Priority Queue)" << endl;
        cout << string(60, '=') << endl;
        cout << "1. Display Room Availability" << endl;
        cout << "2. Display Student Applications (Priority Order)" << endl;
        cout << "3. Run Allocation Algorithm" << endl;
        cout << "4. Display Results" << endl;
        cout << "5. Add New Student Application" << endl;
        cout << "6. Exit" << endl;
        cout << string(60, '=') << endl;
        cout << "Select option: ";
    }

    void run() {
        int choice;
        bool allocated = false;

        while (true) {
            displayMenu();
            cin >> choice;

            switch (choice) {
                case 1:
                    displayRoomAvailability();
                    break;
                case 2:
                    displayStudentApplications();
                    break;
                case 3:
                    runAllocationAlgorithm();
                    allocated = true;
                    break;
                case 4:
                    if (allocated) {
                        displayResults();
                    } else {
                        cout << "\nPlease run allocation algorithm first!" << endl;
                    }
                    break;
                case 5:
                    addNewStudent();
                    break;
                case 6:
                    cout << "\nThank you for using the Hostel Allocation System!" << endl;
                    return;
                default:
                    cout << "\nInvalid choice. Please try again." << endl;
            }

            cout << "\nPress Enter to continue...";
            cin.ignore();
            cin.get();
        }
    }
};

// Heap demonstration functions
void demonstrateHeapOperations() {
    cout << "\n" << string(60, '=') << endl;
    cout << "        MAX HEAP DATA STRUCTURE DEMO" << endl;
    cout << string(60, '=') << endl;

    priority_queue<shared_ptr<Student>, vector<shared_ptr<Student>>, StudentComparator> demoHeap;

    // Create sample students for demonstration with reasonable values
    vector<shared_ptr<Student>> demoStudents = {
        make_shared<Student>("Alice Green", "001", 3.5, "None", vector<string>{"A101"}),
        make_shared<Student>("Bob Johnson", "002", 3.8, "Academic", vector<string>{"A102"}),
        make_shared<Student>("Charlie Brown", "003", 2.9, "Medical", vector<string>{"A103"}),
        make_shared<Student>("Diana Smith", "004", 3.2, "Sports", vector<string>{"A104"})
    };

    cout << "\nInserting students into MAX-heap:" << endl;
    for (auto student : demoStudents) {
        demoHeap.push(student);
        cout << "Inserted: " << student->name << " (Priority Score: "
             << fixed << setprecision(2) << student->priorityScore << ")" << endl;
    }

    cout << "\nExtracting students from heap (HIGHEST priority first):" << endl;
    while (!demoHeap.empty()) {
        auto student = demoHeap.top();
        demoHeap.pop();
        cout << "Extracted: " << student->name << " (Priority Score: "
             << fixed << setprecision(2) << student->priorityScore << ")" << endl;
    }
}

int main() {
    srand(time(nullptr)); // For random timestamp generation

    cout << "Welcome to the Hostel Room Allocation System!" << endl;
    cout << "This system uses a MAX-heap priority queue for efficient allocation." << endl;
    cout << "Higher priority score = Higher priority for room allocation." << endl;

    // Demonstrate heap operations first
    demonstrateHeapOperations();

    cout << "\nPress Enter to start the main system...";
    cin.get();

    // Run the main hostel allocation system
    HostelAllocationSystem system;
    system.run();

    return 0;
}