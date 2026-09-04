import { departmentsData } from './departments.js';

export const maleAvatars = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=128&auto=format&fit=crop&q=60'
];

export const femaleAvatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1548142813-c348350df52b?w=128&auto=format&fit=crop&q=60'
];

export const rawStudentProfiles = [
  // --- CSE (30 Students: 1 to 30) ---
  { first: 'Rahul', last: 'Sharma', gender: 'Male', dept: 'CSE', cgpa: 8.92, status: 'Placed', comp: 'Microsoft India', pkg: '44.0 LPA' },
  { first: 'Devansh', last: 'Verma', gender: 'Male', dept: 'CSE', cgpa: 8.45, status: 'Shortlisted', comp: null, pkg: null },
  { first: 'Tanvi', last: 'Kulkarni', gender: 'Female', dept: 'CSE', cgpa: 8.78, status: 'Placed', comp: 'Deloitte USI', pkg: '11.5 LPA' },
  { first: 'Aman', last: 'Gupta', gender: 'Male', dept: 'CSE', cgpa: 6.45, status: 'Ineligible', comp: null, pkg: null, backlogs: 2 },
  { first: 'Aarav', last: 'Patel', gender: 'Male', dept: 'CSE', cgpa: 9.42, status: 'Placed', comp: 'Google India', pkg: '48.0 LPA' },
  { first: 'Ishita', last: 'Sen', gender: 'Female', dept: 'CSE', cgpa: 9.15, status: 'Placed', comp: 'Amazon Web Services', pkg: '36.0 LPA' },
  { first: 'Rohan', last: 'Mehta', gender: 'Male', dept: 'CSE', cgpa: 8.35, status: 'Placed', comp: 'Oracle India', pkg: '18.0 LPA' },
  { first: 'Priyanka', last: 'Chopra', gender: 'Female', dept: 'CSE', cgpa: 8.60, status: 'Shortlisted', comp: null, pkg: null },
  { first: 'Kunal', last: 'Bansal', gender: 'Male', dept: 'CSE', cgpa: 7.90, status: 'Applied', comp: null, pkg: null },
  { first: 'Neha', last: 'Singhal', gender: 'Female', dept: 'CSE', cgpa: 8.20, status: 'Placed', comp: 'Accenture India', pkg: '9.5 LPA' },
  { first: 'Siddharth', last: 'Joshi', gender: 'Male', dept: 'CSE', cgpa: 9.05, status: 'Placed', comp: 'Zomato', pkg: '28.0 LPA' },
  { first: 'Diya', last: 'Menon', gender: 'Female', dept: 'CSE', cgpa: 8.70, status: 'Seeking', comp: null, pkg: null },
  { first: 'Varun', last: 'Aggarwal', gender: 'Male', dept: 'CSE', cgpa: 7.65, status: 'Applied', comp: null, pkg: null },
  { first: 'Rhea', last: 'Kapoor', gender: 'Female', dept: 'CSE', cgpa: 8.85, status: 'Placed', comp: 'Swiggy', pkg: '24.0 LPA' },
  { first: 'Aditya', last: 'Saxena', gender: 'Male', dept: 'CSE', cgpa: 8.10, status: 'In Process', comp: null, pkg: null },
  { first: 'Meera', last: 'Nair', gender: 'Female', dept: 'CSE', cgpa: 9.25, status: 'Placed', comp: 'Microsoft India', pkg: '44.0 LPA' },
  { first: 'Kabir', last: 'Bhatia', gender: 'Male', dept: 'CSE', cgpa: 7.80, status: 'Applied', comp: null, pkg: null },
  { first: 'Ananya', last: 'Mishra', gender: 'Female', dept: 'CSE', cgpa: 8.55, status: 'Placed', comp: 'Cisco Systems', pkg: '16.5 LPA' },
  { first: 'Yash', last: 'Chauhan', gender: 'Male', dept: 'CSE', cgpa: 7.40, status: 'Seeking', comp: null, pkg: null },
  { first: 'Simran', last: 'Kaur', gender: 'Female', dept: 'CSE', cgpa: 8.40, status: 'Placed', comp: 'Tata Consultancy Services', pkg: '8.0 LPA' },
  { first: 'Arjun', last: 'Rao', gender: 'Male', dept: 'CSE', cgpa: 9.60, status: 'Placed', comp: 'Google India', pkg: '52.0 LPA' },
  { first: 'Shreya', last: 'Ghosh', gender: 'Female', dept: 'CSE', cgpa: 8.15, status: 'Shortlisted', comp: null, pkg: null },
  { first: 'Harsh', last: 'Vardhan', gender: 'Male', dept: 'CSE', cgpa: 7.25, status: 'Unplaced', comp: null, pkg: null },
  { first: 'Tara', last: 'Bhattacharya', gender: 'Female', dept: 'CSE', cgpa: 8.95, status: 'Placed', comp: 'Amazon Web Services', pkg: '38.0 LPA' },
  { first: 'Manish', last: 'Tiwari', gender: 'Male', dept: 'CSE', cgpa: 6.80, status: 'Seeking', comp: null, pkg: null },
  { first: 'Kritika', last: 'Dubey', gender: 'Female', dept: 'CSE', cgpa: 8.30, status: 'Placed', comp: 'Infosys Limited', pkg: '8.5 LPA' },
  { first: 'Prateek', last: 'Srivastava', gender: 'Male', dept: 'CSE', cgpa: 7.75, status: 'Applied', comp: null, pkg: null },
  { first: 'Bhavna', last: 'Pandey', gender: 'Female', dept: 'CSE', cgpa: 8.65, status: 'Placed', comp: 'PwC India', pkg: '10.5 LPA' },
  { first: 'Gaurav', last: 'Nigam', gender: 'Male', dept: 'CSE', cgpa: 6.30, status: 'Ineligible', comp: null, pkg: null, backlogs: 1 },
  { first: 'Avani', last: 'Chaturvedi', gender: 'Female', dept: 'CSE', cgpa: 9.10, status: 'Placed', comp: 'Zomato', pkg: '26.0 LPA' },

  // --- IT (25 Students: 31 to 55) ---
  { first: 'Ananya', last: 'Deshpande', gender: 'Female', dept: 'IT', cgpa: 9.35, status: 'Placed', comp: 'Zomato', pkg: '28.0 LPA' },
  { first: 'Pooja', last: 'Iyer', gender: 'Female', dept: 'IT', cgpa: 7.64, status: 'Applied', comp: null, pkg: null },
  { first: 'Rishi', last: 'Malhotra', gender: 'Male', dept: 'IT', cgpa: 8.50, status: 'Placed', comp: 'Deloitte USI', pkg: '12.0 LPA' },
  { first: 'Sneha', last: 'Roy', gender: 'Female', dept: 'IT', cgpa: 8.80, status: 'Placed', comp: 'Oracle India', pkg: '19.0 LPA' },
  { first: 'Vikram', last: 'Singh', gender: 'Male', dept: 'IT', cgpa: 7.95, status: 'Shortlisted', comp: null, pkg: null },
  { first: 'Trisha', last: 'Mukherjee', gender: 'Female', dept: 'IT', cgpa: 8.25, status: 'Placed', comp: 'Cognizant Technology', pkg: '7.5 LPA' },
  { first: 'Akash', last: 'Tripathi', gender: 'Male', dept: 'IT', cgpa: 7.10, status: 'Seeking', comp: null, pkg: null },
  { first: 'Nandini', last: 'Shukla', gender: 'Female', dept: 'IT', cgpa: 8.90, status: 'Placed', comp: 'Amazon Web Services', pkg: '34.0 LPA' },
  { first: 'Chirag', last: 'Desai', gender: 'Male', dept: 'IT', cgpa: 8.15, status: 'In Process', comp: null, pkg: null },
  { first: 'Lavanya', last: 'Krishnan', gender: 'Female', dept: 'IT', cgpa: 8.60, status: 'Placed', comp: 'Cisco Systems', pkg: '17.0 LPA' },
  { first: 'Nikhil', last: 'Kashyap', gender: 'Male', dept: 'IT', cgpa: 7.50, status: 'Applied', comp: null, pkg: null },
  { first: 'Sakshi', last: 'Tanwar', gender: 'Female', dept: 'IT', cgpa: 9.05, status: 'Placed', comp: 'Microsoft India', pkg: '42.0 LPA' },
  { first: 'Deepak', last: 'Rawat', gender: 'Male', dept: 'IT', cgpa: 7.30, status: 'Unplaced', comp: null, pkg: null },
  { first: 'Anushka', last: 'Garg', gender: 'Female', dept: 'IT', cgpa: 8.40, status: 'Placed', comp: 'Accenture India', pkg: '10.0 LPA' },
  { first: 'Ayush', last: 'Bhardwaj', gender: 'Male', dept: 'IT', cgpa: 7.85, status: 'Shortlisted', comp: null, pkg: null },
  { first: 'Payal', last: 'Sinha', gender: 'Female', dept: 'IT', cgpa: 8.70, status: 'Placed', comp: 'Swiggy', pkg: '22.0 LPA' },
  { first: 'Sameer', last: 'Qureshi', gender: 'Male', dept: 'IT', cgpa: 6.95, status: 'Seeking', comp: null, pkg: null },
  { first: 'Divya', last: 'Somani', gender: 'Female', dept: 'IT', cgpa: 8.10, status: 'Placed', comp: 'Infosys Limited', pkg: '7.8 LPA' },
  { first: 'Suraj', last: 'Gowda', gender: 'Male', dept: 'IT', cgpa: 7.70, status: 'Applied', comp: null, pkg: null },
  { first: 'Juhi', last: 'Chawla', gender: 'Female', dept: 'IT', cgpa: 8.55, status: 'Placed', comp: 'Tata Consultancy Services', pkg: '8.2 LPA' },
  { first: 'Kartik', last: 'Shetty', gender: 'Male', dept: 'IT', cgpa: 9.20, status: 'Placed', comp: 'Google India', pkg: '46.0 LPA' },
  { first: 'Garima', last: 'Rastogi', gender: 'Female', dept: 'IT', cgpa: 8.00, status: 'Shortlisted', comp: null, pkg: null },
  { first: 'Mayank', last: 'Solanki', gender: 'Male', dept: 'IT', cgpa: 6.40, status: 'Ineligible', comp: null, pkg: null, backlogs: 1 },
  { first: 'Mehak', last: 'Arora', gender: 'Female', dept: 'IT', cgpa: 8.65, status: 'Placed', comp: 'PwC India', pkg: '11.0 LPA' },
  { first: 'Abhinav', last: 'Pillai', gender: 'Male', dept: 'IT', cgpa: 7.80, status: 'Applied', comp: null, pkg: null },

  // --- ECE (20 Students: 56 to 75) ---
  { first: 'Rhea', last: 'Chatterjee', gender: 'Female', dept: 'ECE', cgpa: 7.85, status: 'Applied', comp: null, pkg: null },
  { first: 'Tushar', last: 'Soni', gender: 'Male', dept: 'ECE', cgpa: 8.90, status: 'Placed', comp: 'Qualcomm India', pkg: '24.0 LPA' },
  { first: 'Ankita', last: 'Banerjee', gender: 'Female', dept: 'ECE', cgpa: 8.40, status: 'Placed', comp: 'Texas Instruments', pkg: '21.0 LPA' },
  { first: 'Vivek', last: 'Mohan', gender: 'Male', dept: 'ECE', cgpa: 7.60, status: 'Shortlisted', comp: null, pkg: null },
  { first: 'Shruti', last: 'Hegde', gender: 'Female', dept: 'ECE', cgpa: 8.75, status: 'Placed', comp: 'Cisco Systems', pkg: '18.0 LPA' },
  { first: 'Girish', last: 'Kumar', gender: 'Male', dept: 'ECE', cgpa: 7.15, status: 'Seeking', comp: null, pkg: null },
  { first: 'Kalyani', last: 'Jadhav', gender: 'Female', dept: 'ECE', cgpa: 8.20, status: 'Placed', comp: 'Deloitte USI', pkg: '10.5 LPA' },
  { first: 'Parth', last: 'Shah', gender: 'Male', dept: 'ECE', cgpa: 8.80, status: 'Placed', comp: 'Qualcomm India', pkg: '26.0 LPA' },
  { first: 'Mansi', last: 'Bose', gender: 'Female', dept: 'ECE', cgpa: 7.50, status: 'Applied', comp: null, pkg: null },
  { first: 'Naveen', last: 'Rajan', gender: 'Male', dept: 'ECE', cgpa: 8.10, status: 'In Process', comp: null, pkg: null },
  { first: 'Pallavi', last: 'Naidu', gender: 'Female', dept: 'ECE', cgpa: 8.60, status: 'Placed', comp: 'Texas Instruments', pkg: '22.0 LPA' },
  { first: 'Ashish', last: 'Choudhary', gender: 'Male', dept: 'ECE', cgpa: 6.90, status: 'Unplaced', comp: null, pkg: null },
  { first: 'Ritika', last: 'Thakur', gender: 'Female', dept: 'ECE', cgpa: 8.30, status: 'Placed', comp: 'Accenture India', pkg: '9.0 LPA' },
  { first: 'Sachin', last: 'Mishra', gender: 'Male', dept: 'ECE', cgpa: 7.70, status: 'Applied', comp: null, pkg: null },
  { first: 'Swati', last: 'Sengupta', gender: 'Female', dept: 'ECE', cgpa: 8.50, status: 'Placed', comp: 'L&T Technology Services', pkg: '7.8 LPA' },
  { first: 'Karan', last: 'Talwar', gender: 'Male', dept: 'ECE', cgpa: 9.15, status: 'Placed', comp: 'Qualcomm India', pkg: '28.0 LPA' },
  { first: 'Shalini', last: 'Dixit', gender: 'Female', dept: 'ECE', cgpa: 7.45, status: 'Seeking', comp: null, pkg: null },
  { first: 'Tarun', last: 'Bajaj', gender: 'Male', dept: 'ECE', cgpa: 6.20, status: 'Ineligible', comp: null, pkg: null, backlogs: 2 },
  { first: 'Madhuri', last: 'Bhat', gender: 'Female', dept: 'ECE', cgpa: 8.05, status: 'Shortlisted', comp: null, pkg: null },
  { first: 'Hemant', last: 'Yadav', gender: 'Male', dept: 'ECE', cgpa: 7.80, status: 'Placed', comp: 'Tata Consultancy Services', pkg: '7.5 LPA' },

  // --- EEE (15 Students: 76 to 90) ---
  { first: 'Siddharth', last: 'Nambiar', gender: 'Male', dept: 'EEE', cgpa: 8.12, status: 'Placed', comp: 'Cisco Systems', pkg: '16.0 LPA' },
  { first: 'Aparna', last: 'Venkatesh', gender: 'Female', dept: 'EEE', cgpa: 8.70, status: 'Placed', comp: 'Texas Instruments', pkg: '19.5 LPA' },
  { first: 'Gautam', last: 'Das', gender: 'Male', dept: 'EEE', cgpa: 7.55, status: 'Applied', comp: null, pkg: null },
  { first: 'Kavita', last: 'Namboodiri', gender: 'Female', dept: 'EEE', cgpa: 8.25, status: 'Placed', comp: 'L&T Technology Services', pkg: '7.5 LPA' },
  { first: 'Umesh', last: 'Kulkarni', gender: 'Male', dept: 'EEE', cgpa: 7.20, status: 'Seeking', comp: null, pkg: null },
  { first: 'Harini', last: 'Sridhar', gender: 'Female', dept: 'EEE', cgpa: 8.90, status: 'Placed', comp: 'Schneider Electric', pkg: '14.0 LPA' },
  { first: 'Rajat', last: 'Pathak', gender: 'Male', dept: 'EEE', cgpa: 7.80, status: 'Shortlisted', comp: null, pkg: null },
  { first: 'Geeta', last: 'Bhardwaj', gender: 'Female', dept: 'EEE', cgpa: 8.40, status: 'Placed', comp: 'Tata Consultancy Services', pkg: '7.2 LPA' },
  { first: 'Manoj', last: 'Prasad', gender: 'Male', dept: 'EEE', cgpa: 6.85, status: 'Unplaced', comp: null, pkg: null },
  { first: 'Sangeeta', last: 'Mohapatra', gender: 'Female', dept: 'EEE', cgpa: 8.00, status: 'Applied', comp: null, pkg: null },
  { first: 'Nitin', last: 'Sood', gender: 'Male', dept: 'EEE', cgpa: 8.60, status: 'Placed', comp: 'Accenture India', pkg: '8.8 LPA' },
  { first: 'Archana', last: 'Jha', gender: 'Female', dept: 'EEE', cgpa: 7.65, status: 'In Process', comp: null, pkg: null },
  { first: 'Sanjay', last: 'Pawar', gender: 'Male', dept: 'EEE', cgpa: 6.10, status: 'Ineligible', comp: null, pkg: null, backlogs: 2 },
  { first: 'Vidya', last: 'Balasubramanian', gender: 'Female', dept: 'EEE', cgpa: 8.35, status: 'Placed', comp: 'Infosys Limited', pkg: '7.0 LPA' },
  { first: 'Bharat', last: 'Bose', gender: 'Male', dept: 'EEE', cgpa: 7.90, status: 'Applied', comp: null, pkg: null },

  // --- MECH (10 Students: 91 to 100) ---
  { first: 'Aditya', last: 'Patel', gender: 'Male', dept: 'MECH', cgpa: 7.42, status: 'Placed', comp: 'Tata Consultancy Services', pkg: '7.2 LPA' },
  { first: 'Kavya', last: 'Reddy', gender: 'Female', dept: 'MECH', cgpa: 7.95, status: 'Unplaced', comp: null, pkg: null },
  { first: 'Pranav', last: 'Deshmukh', gender: 'Male', dept: 'MECH', cgpa: 8.65, status: 'Placed', comp: 'L&T Technology Services', pkg: '8.5 LPA' },
  { first: 'Ira', last: 'Goswami', gender: 'Female', dept: 'MECH', cgpa: 8.30, status: 'Placed', comp: 'Mahindra & Mahindra', pkg: '9.0 LPA' },
  { first: 'Vineet', last: 'Khurana', gender: 'Male', dept: 'MECH', cgpa: 7.10, status: 'Seeking', comp: null, pkg: null },
  { first: 'Meenakshi', last: 'Srivastava', gender: 'Female', dept: 'MECH', cgpa: 8.15, status: 'Shortlisted', comp: null, pkg: null },
  { first: 'Deepen', last: 'Chhabra', gender: 'Male', dept: 'MECH', cgpa: 7.80, status: 'Applied', comp: null, pkg: null },
  { first: 'Sunita', last: 'Rathore', gender: 'Female', dept: 'MECH', cgpa: 8.50, status: 'Placed', comp: 'Tata Motors', pkg: '8.8 LPA' },
  { first: 'Alok', last: 'Nath', gender: 'Male', dept: 'MECH', cgpa: 6.50, status: 'Ineligible', comp: null, pkg: null, backlogs: 1 },
  { first: 'Varsha', last: 'Mhatre', gender: 'Female', dept: 'MECH', cgpa: 7.75, status: 'Applied', comp: null, pkg: null }
];

export const deptSkills = {
  CSE: {
    skills: [
      ['React.js', 'Node.js', 'MongoDB', 'Data Structures', 'TypeScript'],
      ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS'],
      ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'MySQL'],
      ['Next.js', 'Tailwind CSS', 'Redux', 'GraphQL', 'Express.js'],
      ['Machine Learning', 'TensorFlow', 'NLP', 'Computer Vision', 'PyTorch'],
      ['Kubernetes', 'CI/CD', 'Docker', 'GCP', 'Terraform', 'Linux']
    ],
    languages: [
      ['Java', 'JavaScript', 'C++', 'Python'],
      ['Python', 'TypeScript', 'SQL', 'Go'],
      ['C++', 'Java', 'Python', 'Rust'],
      ['JavaScript', 'TypeScript', 'HTML/CSS', 'Python']
    ]
  },
  IT: {
    skills: [
      ['Go', 'Kubernetes', 'Docker', 'AWS', 'Distributed Systems'],
      ['SQL', 'Tableau', 'PowerBI', 'Python', 'Data Analysis'],
      ['React.js', 'Node.js', 'REST APIs', 'PostgreSQL', 'Redis'],
      ['Cybersecurity', 'Network Security', 'Ethical Hacking', 'Linux', 'SIEM'],
      ['Cloud Architecture', 'Azure', 'DevOps', 'Docker', 'Bash']
    ],
    languages: [
      ['Go', 'Python', 'C++', 'SQL'],
      ['Python', 'SQL', 'R', 'JavaScript'],
      ['Java', 'JavaScript', 'TypeScript', 'SQL'],
      ['Python', 'Bash', 'C', 'SQL']
    ]
  },
  ECE: {
    skills: [
      ['Embedded C', 'IoT', 'MATLAB', 'VLSI', 'Python'],
      ['Verilog', 'FPGA Design', 'Digital Signal Processing', 'SystemVerilog'],
      ['Microcontrollers', 'Arduino', 'Raspberry Pi', 'PCB Design', 'Altium'],
      ['RF Engineering', 'Wireless Communication', '5G Protocols', 'MATLAB']
    ],
    languages: [
      ['C', 'C++', 'Python'],
      ['Verilog', 'C', 'MATLAB', 'Python'],
      ['C', 'Assembly', 'Python'],
      ['MATLAB', 'C++', 'Python']
    ]
  },
  EEE: {
    skills: [
      ['Power Systems', 'PLC/SCADA', 'MATLAB', 'Circuit Design'],
      ['Control Systems', 'Simulink', 'Power Electronics', 'Renewable Energy'],
      ['Smart Grids', 'Electric Vehicles', 'Battery Management', 'AutoCAD Electrical'],
      ['Industrial Automation', 'Sensors & Transducers', 'Microprocessors']
    ],
    languages: [
      ['C', 'Python', 'MATLAB'],
      ['MATLAB', 'C++', 'Python'],
      ['Python', 'C', 'Assembly']
    ]
  },
  MECH: {
    skills: [
      ['SolidWorks', 'AutoCAD', 'ANSYS', 'Finite Element Analysis'],
      ['Thermodynamics', 'Catia V5', 'Robotics', 'MATLAB'],
      ['Mechatronics', 'CNC Programming', '3D Printing', 'Fluid Mechanics'],
      ['Manufacturing Processes', 'GD&T', 'Automotive Engineering', 'CFD']
    ],
    languages: [
      ['Python', 'MATLAB'],
      ['C++', 'Python'],
      ['MATLAB', 'C']
    ]
  }
};

export const generate100Students = () => {
  const students = [];
  const deptCounters = { CSE: 0, IT: 0, ECE: 0, EEE: 0, MECH: 0 };

  rawStudentProfiles.forEach((profile, idx) => {
    deptCounters[profile.dept]++;
    const rollNum = String(deptCounters[profile.dept]).padStart(3, '0');
    const studentId = `2021${profile.dept}${rollNum}`;

    const firstNameClean = profile.first.trim();
    const lastNameClean = profile.last.trim();
    const fullName = `${firstNameClean} ${lastNameClean}`;
    const emailSlug = `${firstNameClean.toLowerCase()}.${lastNameClean.toLowerCase().slice(0, 3)}${21 + (idx % 80)}`;
    const email = `${emailSlug}@college.edu.in`;

    const phoneNum = 9000000000 + ((idx * 137492 + 84920) % 999999999);
    const phone = `+91 ${String(phoneNum).slice(0, 5)} ${String(phoneNum).slice(5)}`;

    const birthYear = 2002 + (idx % 2);
    const birthMonth = String(1 + (idx % 12)).padStart(2, '0');
    const birthDay = String(1 + ((idx * 7) % 28)).padStart(2, '0');
    const dateOfBirth = `${birthYear}-${birthMonth}-${birthDay}`;

    const avatarPool = profile.gender === 'Female' ? femaleAvatars : maleAvatars;
    const avatar = avatarPool[idx % avatarPool.length];

    const deptSkillConfig = deptSkills[profile.dept];
    const skills = deptSkillConfig.skills[idx % deptSkillConfig.skills.length];
    const programmingLanguages = deptSkillConfig.languages[idx % deptSkillConfig.languages.length];

    const usernameSlug = `${firstNameClean.toLowerCase()}${lastNameClean.toLowerCase()}`;
    const github = profile.dept === 'MECH' && idx % 3 === 0 ? '' : `https://github.com/${usernameSlug}`;
    const linkedin = `https://linkedin.com/in/${usernameSlug}`;
    const portfolio = profile.cgpa >= 8.5 ? `https://${usernameSlug}.dev` : '';
    const resumeUrl = `https://example.com/resumes/${usernameSlug}.pdf`;

    const backlogs = profile.backlogs || 0;
    const isEligible = backlogs === 0 && profile.cgpa >= 6.0 && profile.status !== 'Ineligible';

    const fullDeptName = departmentsData.find((d) => d.code === profile.dept)?.name || 'Engineering';

    students.push({
      id: `stud-${idx + 1}`,
      studentId,
      firstName: firstNameClean,
      lastName: lastNameClean,
      fullName,
      email,
      phone,
      dateOfBirth,
      gender: profile.gender,
      department: fullDeptName,
      deptCode: profile.dept,
      course: 'B.Tech',
      batch: '2021-2025',
      semester: 8,
      cgpa: profile.cgpa,
      backlogs,
      skills,
      programmingLanguages,
      resumeUrl: isEligible ? resumeUrl : '',
      github,
      linkedin,
      portfolio,
      placementStatus: profile.status,
      placedCompany: profile.comp,
      placedPackage: profile.pkg,
      isEligible,
      avatar
    });
  });

  return students;
};
