import initialDrives from '../data/placementDrives.json';
import initialInterviews from '../data/interviews.json';

export const calendarService = {
  getEvents: async ({ month = 3, year = 2025, eventType = 'All', company = 'All' } = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 60));

    const events = [
      // 1. Placement Drives
      {
        id: 'evt-1',
        title: 'Microsoft SDE-1 Placement Drive',
        type: 'Drive',
        date: '2025-03-28',
        time: '09:00 AM - 05:00 PM',
        company: 'Microsoft India',
        location: 'Online Assessment & Virtual Panels',
        driveId: 'drive-1',
        color: '#2F8F78',
        description: 'Campus hiring drive for Cloud + AI engineering roles.'
      },
      {
        id: 'evt-2',
        title: 'Zomato Backend Engineer Drive',
        type: 'Drive',
        date: '2025-03-24',
        time: '10:00 AM - 04:00 PM',
        company: 'Zomato',
        location: 'Gurugram HQ / Remote',
        driveId: 'drive-2',
        color: '#2F8F78',
        description: 'Hackathon coding assessment and interview rounds.'
      },
      {
        id: 'evt-3',
        title: 'Deloitte USI Tech Consulting Drive',
        type: 'Drive',
        date: '2025-03-22',
        time: '09:30 AM - 06:00 PM',
        company: 'Deloitte USI',
        location: 'Campus Main Auditorium & Seminar Halls',
        driveId: 'drive-3',
        color: '#2F8F78',
        description: 'Case study presentation, GD, and partner interviews.'
      },
      {
        id: 'evt-4',
        title: 'TCS Digital NQT Assessment',
        type: 'Assessment',
        date: '2025-03-16',
        time: '11:00 AM - 01:00 PM',
        company: 'Tata Consultancy Services',
        location: 'Computer Center Labs 1 - 4',
        driveId: 'drive-4',
        color: '#38BDF8',
        description: 'National Qualifier Test for Digital & Innovator profiles.'
      },

      // 2. Application Deadlines
      {
        id: 'evt-5',
        title: 'Deadline: Microsoft SDE-1 Applications',
        type: 'Deadline',
        date: '2025-03-25',
        time: '11:59 PM',
        company: 'Microsoft India',
        location: 'UdyamPath Portal',
        driveId: 'drive-1',
        color: '#F59E0B',
        description: 'Final cutoff timestamp for candidate registrations.'
      },
      {
        id: 'evt-6',
        title: 'Deadline: Zomato Applications',
        type: 'Deadline',
        date: '2025-03-20',
        time: '11:59 PM',
        company: 'Zomato',
        location: 'UdyamPath Portal',
        driveId: 'drive-2',
        color: '#F59E0B',
        description: 'Candidate resume submission deadline.'
      },
      {
        id: 'evt-7',
        title: 'Deadline: Deloitte USI Applications',
        type: 'Deadline',
        date: '2025-03-18',
        time: '11:59 PM',
        company: 'Deloitte USI',
        location: 'UdyamPath Portal',
        driveId: 'drive-3',
        color: '#F59E0B',
        description: 'Eligible registrations close for Tech Consulting.'
      },

      // 3. Pre-Placement Talks (PPTs)
      {
        id: 'evt-8',
        title: 'Pre-Placement Talk: Cisco Systems',
        type: 'Pre-Placement Talk',
        date: '2025-03-14',
        time: '04:00 PM - 05:30 PM',
        company: 'Cisco Systems',
        location: 'Seminar Hall 1 & Live Webcast',
        color: '#A855F7',
        description: 'Corporate briefing on Networking & Cloud infrastructure opportunities.'
      },

      // 4. Interviews
      {
        id: 'evt-9',
        title: 'Technical Round 2: Devansh Verma',
        type: 'Interview',
        date: '2025-03-15',
        time: '10:30 AM - 11:30 AM',
        company: 'Microsoft India',
        location: 'MS Teams',
        color: '#EC4899',
        description: 'System Design and Code Quality interview round.'
      },
      {
        id: 'evt-10',
        title: 'Case Study & GD: Rhea Chatterjee',
        type: 'Interview',
        date: '2025-03-15',
        time: '02:00 PM - 03:15 PM',
        company: 'Deloitte USI',
        location: 'Campus Seminar Hall 2',
        color: '#EC4899',
        description: 'Business consulting evaluation session.'
      }
    ];

    let result = [...events];
    if (eventType !== 'All') {
      result = result.filter((e) => e.type === eventType);
    }
    if (company !== 'All') {
      result = result.filter((e) => e.company === company);
    }

    return result;
  }
};
