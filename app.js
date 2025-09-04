// Heap Data Structure Implementation - MAX HEAP (FIXED)
class MaxHeap {
    constructor() {
        this.heap = [];
    }

    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    getRightChildIndex(index) {
        return 2 * index + 2;
    }

    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    insert(student) {
        this.heap.push(student);
        this.heapifyUp(this.heap.length - 1);
    }

    heapifyUp(index) {
        if (index === 0) return;
        const parentIndex = this.getParentIndex(index);
        // Max heap: parent should be larger than child
        if (this.heap[parentIndex].priorityScore < this.heap[index].priorityScore) {
            this.swap(parentIndex, index);
            this.heapifyUp(parentIndex);
        }
    }

    extractMax() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const max = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return max;
    }

    heapifyDown(index) {
        const leftChildIndex = this.getLeftChildIndex(index);
        const rightChildIndex = this.getRightChildIndex(index);
        let largestIndex = index;

        // Max heap: find the largest among parent and children
        if (leftChildIndex < this.heap.length && this.heap[leftChildIndex].priorityScore > this.heap[largestIndex].priorityScore) {
            largestIndex = leftChildIndex;
        }

        if (rightChildIndex < this.heap.length && this.heap[rightChildIndex].priorityScore > this.heap[largestIndex].priorityScore) {
            largestIndex = rightChildIndex;
        }

        if (largestIndex !== index) {
            this.swap(index, largestIndex);
            this.heapifyDown(largestIndex);
        }
    }

    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    size() {
        return this.heap.length;
    }

    toArray() {
        return [...this.heap];
    }

    clear() {
        this.heap = [];
    }
}

// Application State Management - FIXED
class HostelAllotmentSystem {
    constructor() {
        this.studentHeap = new MaxHeap();
        this.rooms = [];
        this.allocations = [];
        this.specialPriorityMultipliers = {
            "None": 1.0,
            "Medical": 2.0,
            "Sports": 1.5,
            "Academic Excellence": 1.8,
            "Financial Aid": 1.3
        };
        this.initializeData();
        // Delay UI initialization to ensure DOM is ready
        setTimeout(() => this.initializeUI(), 100);
    }

    initializeData() {
        // Sample rooms data - simplified without features
        this.rooms = [
            {"id": "A101", "type": "Single", "capacity": 1, "occupied": 0, "floor": 1, "building": "A"},
            {"id": "A102", "type": "Double", "capacity": 2, "occupied": 0, "floor": 1, "building": "A"},
            {"id": "A103", "type": "Triple", "capacity": 3, "occupied": 1, "floor": 1, "building": "A"},
            {"id": "A201", "type": "Single", "capacity": 1, "occupied": 1, "floor": 2, "building": "A"},
            {"id": "A202", "type": "Double", "capacity": 2, "occupied": 0, "floor": 2, "building": "A"},
            {"id": "B101", "type": "Double", "capacity": 2, "occupied": 1, "floor": 1, "building": "B"},
            {"id": "B102", "type": "Triple", "capacity": 3, "occupied": 0, "floor": 1, "building": "B"},
            {"id": "B201", "type": "Single", "capacity": 1, "occupied": 0, "floor": 2, "building": "B"},
            {"id": "B202", "type": "Double", "capacity": 2, "occupied": 2, "floor": 2, "building": "B"},
            {"id": "C101", "type": "Triple", "capacity": 3, "occupied": 0, "floor": 1, "building": "C"},
            {"id": "C102", "type": "Single", "capacity": 1, "occupied": 0, "floor": 1, "building": "C"},
            {"id": "C201", "type": "Double", "capacity": 2, "occupied": 0, "floor": 2, "building": "C"},
            {"id": "C202", "type": "Triple", "capacity": 3, "occupied": 2, "floor": 2, "building": "C"},
            {"id": "D101", "type": "Single", "capacity": 1, "occupied": 0, "floor": 1, "building": "D"},
            {"id": "D102", "type": "Double", "capacity": 2, "occupied": 1, "floor": 1, "building": "D"},
            {"id": "D201", "type": "Triple", "capacity": 3, "occupied": 0, "floor": 2, "building": "D"},
            {"id": "D202", "type": "Single", "capacity": 1, "occupied": 0, "floor": 2, "building": "D"},
            {"id": "E101", "type": "Double", "capacity": 2, "occupied": 0, "floor": 1, "building": "E"},
            {"id": "E102", "type": "Triple", "capacity": 3, "occupied": 1, "floor": 1, "building": "E"},
            {"id": "E201", "type": "Single", "capacity": 1, "occupied": 0, "floor": 2, "building": "E"}
        ];

        // Sample applications with reasonable values
        const sampleApplications = [
            {"name": "Alice Green", "studentId": "CS2024001", "gpa": 4.0, "specialPriority": "Academic Excellence", "preferences": ["A101", "B201", "D202"], "timestamp": Date.now() - 100000},
            {"name": "Bob Johnson", "studentId": "CS2024002", "gpa": 3.6, "specialPriority": "None", "preferences": ["A202", "C201", "E101"], "timestamp": Date.now() - 95000},
            {"name": "Maya Patel", "studentId": "CS2024003", "gpa": 3.8, "specialPriority": "Sports", "preferences": ["B102", "C101", "D201"], "timestamp": Date.now() - 90000},
            {"name": "Carlos Rodriguez", "studentId": "CS2024004", "gpa": 2.9, "specialPriority": "Medical", "preferences": ["A101", "B201", "C102"], "timestamp": Date.now() - 85000},
            {"name": "Sophia Kim", "studentId": "CS2024005", "gpa": 3.3, "specialPriority": "Financial Aid", "preferences": ["A103", "B101", "C202"], "timestamp": Date.now() - 80000},
            {"name": "James Wilson", "studentId": "CS2024006", "gpa": 3.4, "specialPriority": "None", "preferences": ["D102", "E102", "A202"], "timestamp": Date.now() - 75000},
            {"name": "Emma Davis", "studentId": "CS2024007", "gpa": 3.7, "specialPriority": "Academic Excellence", "preferences": ["E201", "D202", "B201"], "timestamp": Date.now() - 70000},
            {"name": "Alex Chen", "studentId": "CS2024008", "gpa": 3.1, "specialPriority": "Sports", "preferences": ["C101", "B102", "A202"], "timestamp": Date.now() - 65000},
            {"name": "Isabella Martinez", "studentId": "CS2024009", "gpa": 3.5, "specialPriority": "None", "preferences": ["E101", "C201", "A202"], "timestamp": Date.now() - 60000},
            {"name": "Noah Thompson", "studentId": "CS2024010", "gpa": 3.2, "specialPriority": "Medical", "preferences": ["A101", "C102", "D101"], "timestamp": Date.now() - 55000}
        ];

        // Add sample applications to heap
        sampleApplications.forEach(app => {
            const student = this.createStudentFromApplication(app);
            this.studentHeap.insert(student);
        });
    }

    initializeUI() {
        console.log('Initializing UI...');
        // Setup tab navigation first
        this.setupTabNavigation();
        // Then initialize other UI components
        this.populateRoomSelectors();
        this.renderRoomGrid();
        this.renderApplicationsList();
        this.renderRoomMatrix();
        this.updateHeapVisualization();
        this.setupEventListeners();
        console.log('UI initialization complete');
    }

    setupTabNavigation() {
        console.log('Setting up tab navigation...');
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        console.log('Tab buttons found:', tabButtons.length);
        console.log('Tab contents found:', tabContents.length);

        tabButtons.forEach((btn, index) => {
            console.log(`Setting up button ${index}:`, btn.getAttribute('data-tab'));

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = btn.getAttribute('data-tab');
                console.log('Tab clicked:', targetTab);

                // Remove active class from all buttons
                tabButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                // Hide all tab contents
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    content.style.display = 'none';
                });

                // Show the target tab
                const targetContent = document.getElementById(`${targetTab}-tab`);
                if (targetContent) {
                    targetContent.classList.add('active');
                    targetContent.style.display = 'block';
                    console.log('Activated tab:', `${targetTab}-tab`);
                } else {
                    console.error('Target tab content not found:', `${targetTab}-tab`);
                }
            });
        });

        // Ensure first tab is active by default
        const firstTab = document.getElementById('student-tab');
        if (firstTab) {
            firstTab.classList.add('active');
            firstTab.style.display = 'block';
        }
    }

    setupEventListeners() {
        // Student form submission
        const studentForm = document.getElementById('student-form');
        if (studentForm) {
            studentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleStudentFormSubmission();
            });
        }

        // Allocation button
        const allocateBtn = document.getElementById('allocate-btn');
        if (allocateBtn) {
            allocateBtn.addEventListener('click', () => {
                this.runAllocationAlgorithm();
            });
        }

        // Clear allocations button
        const clearBtn = document.getElementById('clear-allocations');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearAllocations();
            });
        }

        // Modal close
        const closeModalBtn = document.getElementById('close-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                const modal = document.getElementById('success-modal');
                if (modal) {
                    modal.classList.add('hidden');
                }
            });
        }
    }

    calculatePriorityScore(gpa, specialPriority, timestamp) {
        // For max heap: Higher score = higher priority
        const basePriority = 1000;
        const specialMultiplier = this.specialPriorityMultipliers[specialPriority];
        const gpaBonus = gpa * 100;
        const timestampBonus = Math.max(0, (Date.now() - timestamp) / (1000 * 60 * 60)); // Hours since submission

        return (basePriority * specialMultiplier) + gpaBonus + timestampBonus;
    }

    createStudentFromApplication(application) {
        const priorityScore = this.calculatePriorityScore(
            application.gpa,
            application.specialPriority,
            application.timestamp
        );

        return {
            ...application,
            priorityScore: Math.round(priorityScore * 100) / 100,
            allocated: false,
            allocatedRoom: null
        };
    }

    handleStudentFormSubmission() {
        const nameInput = document.getElementById('student-name');
        const idInput = document.getElementById('student-id');
        const gpaInput = document.getElementById('gpa');
        const priorityInput = document.getElementById('special-priority');
        const pref1Input = document.getElementById('pref-1');
        const pref2Input = document.getElementById('pref-2');
        const pref3Input = document.getElementById('pref-3');

        if (!nameInput || !idInput || !gpaInput || !priorityInput) {
            console.error('Required form inputs not found');
            return;
        }

        const formData = {
            name: nameInput.value,
            studentId: idInput.value,
            gpa: parseFloat(gpaInput.value),
            specialPriority: priorityInput.value,
            preferences: [
                pref1Input ? pref1Input.value : '',
                pref2Input ? pref2Input.value : '',
                pref3Input ? pref3Input.value : ''
            ].filter(pref => pref !== ''),
            timestamp: Date.now()
        };

        if (!formData.name || !formData.studentId || !formData.gpa) {
            alert('Please fill in all required fields');
            return;
        }

        const student = this.createStudentFromApplication(formData);
        this.studentHeap.insert(student);

        // Update UI
        this.renderApplicationsList();
        this.updateHeapVisualization();

        // Show success modal
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }

        // Reset form
        const form = document.getElementById('student-form');
        if (form) {
            form.reset();
        }
    }

    populateRoomSelectors() {
        const availableRooms = this.rooms.filter(room => room.occupied < room.capacity);
        const selectors = document.querySelectorAll('.room-select');

        selectors.forEach(select => {
            select.innerHTML = '<option value="">Select a room</option>';
            availableRooms.forEach(room => {
                const option = document.createElement('option');
                option.value = room.id;
                option.textContent = `${room.id} - ${room.type} (${room.capacity - room.occupied} spots available)`;
                select.appendChild(option);
            });
        });
    }

    renderRoomGrid() {
        const roomGrid = document.getElementById('room-grid');
        if (!roomGrid) return;

        roomGrid.innerHTML = '';
        this.rooms.forEach(room => {
            const roomCard = document.createElement('div');
            let statusClass = 'available';
            if (room.occupied === room.capacity) {
                statusClass = 'full';
            } else if (room.occupied > 0) {
                statusClass = 'partial';
            }

            roomCard.className = `room-card ${statusClass}`;
            roomCard.innerHTML = `
                <div class="room-header">
                    <span class="room-id">${room.id}</span>
                    <span class="room-type">${room.type}</span>
                </div>
                <div class="room-occupancy">
                    Occupancy: ${room.occupied}/${room.capacity}
                </div>
                <div class="room-info">
                    <div>Floor: ${room.floor}</div>
                    <div>Building: ${room.building}</div>
                </div>
            `;
            roomGrid.appendChild(roomCard);
        });
    }

    renderApplicationsList() {
        const applicationsList = document.getElementById('applications-list');
        if (!applicationsList) return;

        applicationsList.innerHTML = '';

        // Get sorted applications (highest priority first for max heap)
        const applications = this.studentHeap.toArray().sort((a, b) => b.priorityScore - a.priorityScore);

        applications.forEach(student => {
            const applicationItem = document.createElement('div');
            applicationItem.className = 'application-item';
            applicationItem.innerHTML = `
                <div class="student-info">
                    <div class="student-name">${student.name}</div>
                    <div class="student-id">${student.studentId}</div>
                </div>
                <div class="gpa-info">
                    <div class="gpa-value">${student.gpa.toFixed(2)}</div>
                    <div>GPA</div>
                </div>
                <div class="priority-info">
                    <div class="priority-score">${student.priorityScore.toFixed(2)}</div>
                    <div>${student.specialPriority}</div>
                </div>
                <div class="preferences">
                    ${student.preferences.map(pref => `<span class="pref-tag">${pref}</span>`).join('')}
                </div>
                <div class="allocation-status">
                    ${student.allocated ? `✓ ${student.allocatedRoom}` : 'Pending'}
                </div>
            `;
            applicationsList.appendChild(applicationItem);
        });
    }

    renderRoomMatrix() {
        const roomMatrix = document.getElementById('room-matrix');
        if (!roomMatrix) return;

        roomMatrix.innerHTML = '';
        this.rooms.forEach(room => {
            const matrixRoom = document.createElement('div');
            let statusClass = 'available';
            if (room.occupied === room.capacity) {
                statusClass = 'full';
            } else if (room.occupied > 0) {
                statusClass = 'partial';
            }

            matrixRoom.className = `matrix-room ${statusClass}`;
            matrixRoom.textContent = `${room.id} (${room.occupied}/${room.capacity})`;
            roomMatrix.appendChild(matrixRoom);
        });
    }

    updateHeapVisualization() {
        const heapContainer = document.getElementById('heap-container');
        const heapSizeEl = document.getElementById('heap-size');

        if (!heapContainer || !heapSizeEl) return;

        heapSizeEl.textContent = this.studentHeap.size();
        heapContainer.innerHTML = '';

        const heapArray = this.studentHeap.toArray();
        heapArray.forEach((student, index) => {
            const node = document.createElement('div');
            node.className = `heap-node${index === 0 ? ' root' : ''}`;
            node.innerHTML = `
                <div>${student.name.split(' ')[0]}</div>
                <div>${student.priorityScore.toFixed(0)}</div>
            `;
            heapContainer.appendChild(node);
        });
    }

    runAllocationAlgorithm() {
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        const allocationResults = document.getElementById('allocation-results');

        if (progressBar) progressBar.style.width = '0%';
        if (progressText) progressText.textContent = 'Starting allocation...';
        if (allocationResults) allocationResults.innerHTML = '<div>Processing allocations...</div>';

        this.allocations = [];
        const tempHeap = new MaxHeap();

        // Copy all students to temp heap
        this.studentHeap.toArray().forEach(student => {
            tempHeap.insert({...student});
        });

        const totalStudents = tempHeap.size();
        let processedStudents = 0;

        const processNextStudent = () => {
            if (tempHeap.size() === 0) {
                // Allocation complete
                this.displayAllocationResults();
                if (progressBar) progressBar.style.width = '100%';
                if (progressText) progressText.textContent = 'Allocation completed!';
                return;
            }

            const student = tempHeap.extractMax();
            let allocated = false;

            // Try preferred rooms first
            for (const roomId of student.preferences) {
                const room = this.rooms.find(r => r.id === roomId);
                if (room && room.occupied < room.capacity) {
                    room.occupied++;
                    student.allocated = true;
                    student.allocatedRoom = roomId;
                    allocated = true;
                    break;
                }
            }

            // If no preferred room available, try any available room
            if (!allocated) {
                for (const room of this.rooms) {
                    if (room.occupied < room.capacity) {
                        room.occupied++;
                        student.allocated = true;
                        student.allocatedRoom = room.id;
                        allocated = true;
                        break;
                    }
                }
            }

            this.allocations.push(student);
            processedStudents++;

            // Update progress
            const progress = (processedStudents / totalStudents) * 100;
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `Processing: ${student.name}`;

            // Update displays
            this.renderRoomGrid();
            this.renderRoomMatrix();

            // Continue with next student
            setTimeout(processNextStudent, 100);
        };

        processNextStudent();
    }

    displayAllocationResults() {
        const allocationResults = document.getElementById('allocation-results');
        if (!allocationResults) return;

        const allocated = this.allocations.filter(s => s.allocated);
        const waitlisted = this.allocations.filter(s => !s.allocated);

        allocationResults.innerHTML = `
            <div class="results-summary">
                <div class="result-stat">
                    <span class="stat-value">${allocated.length}</span>
                    <span class="stat-label">Allocated</span>
                </div>
                <div class="result-stat">
                    <span class="stat-value">${waitlisted.length}</span>
                    <span class="stat-label">Waitlisted</span>
                </div>
                <div class="result-stat">
                    <span class="stat-value">${Math.round((allocated.length / this.allocations.length) * 100)}%</span>
                    <span class="stat-label">Success Rate</span>
                </div>
            </div>
            <div class="allocation-list">
                ${this.allocations.map(student => `
                    <div class="allocation-item ${student.allocated ? 'success' : 'waitlist'}">
                        <div class="student-info">
                            <div class="student-name">${student.name}</div>
                            <div class="student-id">${student.studentId}</div>
                        </div>
                        <div class="gpa-info">
                            <div class="gpa-value">${student.gpa.toFixed(2)}</div>
                        </div>
                        <div class="priority-info">
                            <div class="priority-score">${student.priorityScore.toFixed(2)}</div>
                        </div>
                        <div class="allocation-result ${student.allocated ? 'allocated' : 'waitlisted'}">
                            ${student.allocated ? `Room ${student.allocatedRoom}` : 'Waitlisted'}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    clearAllocations() {
        // Reset room occupancy to initial state
        this.rooms.forEach(room => {
            room.occupied = Math.floor(Math.random() * (room.capacity + 1)); // Random initial occupancy
        });

        // Reset student allocations
        this.studentHeap.toArray().forEach(student => {
            student.allocated = false;
            student.allocatedRoom = null;
        });

        this.allocations = [];

        // Update displays
        this.renderRoomGrid();
        this.renderRoomMatrix();
        this.renderApplicationsList();

        const allocationResults = document.getElementById('allocation-results');
        if (allocationResults) {
            allocationResults.innerHTML = '<div>Click "Run Allocation Algorithm" to start allocation process.</div>';
        }

        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        if (progressBar) progressBar.style.width = '0%';
        if (progressText) progressText.textContent = 'Ready to allocate';
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing system...');
    const system = new HostelAllotmentSystem();
    console.log('Hostel Allotment System initialized with Max Heap');
});