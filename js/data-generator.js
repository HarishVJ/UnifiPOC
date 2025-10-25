/**
 * Data Generator
 * Generates sample data for demonstration
 */

const DataGenerator = {
    generate() {
        const data = [];
        const prefixes = ['EMP', 'TMP', 'CTR', 'FTE'];
        
        // Generate 120 sample records for pagination demo
        for (let i = 1; i <= 120; i++) {
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const empId = `${prefix}${(10000 + i).toString()}`;
            
            const minutesLate = Math.floor(Math.random() * 40) + 5;
            const scheduleInHour = 8;
            const scheduleOutHour = 16;
            const clockedInMinute = minutesLate;
            const clockedOutMinute = Math.floor(Math.random() * 30);
            
            const scheduleIn = `${scheduleInHour.toString().padStart(2, '0')}:00`;
            const scheduleOut = `${scheduleOutHour.toString().padStart(2, '0')}:00`;
            const clockedIn = `${scheduleInHour.toString().padStart(2, '0')}:${clockedInMinute.toString().padStart(2, '0')}`;
            const clockedOut = `${scheduleOutHour.toString().padStart(2, '0')}:${clockedOutMinute.toString().padStart(2, '0')}`;
            
            data.push({
                id: i - 1,
                employeeId: empId,
                scheduleIn: scheduleIn,
                scheduleOut: scheduleOut,
                clockedIn: clockedIn,
                clockedOut: clockedOut,
                variance: minutesLate,
                excused: i % 3 === 0 ? 'Yes' : i % 3 === 1 ? 'No' : '',
                comment: i % 2 === 0 ? 'Traffic delay due to highway accident' : '',
                kronosStatus: i % 3 === 0 ? 'success' : i % 3 === 1 ? 'pending' : 'failed',
                amhAttachment: null,
                amhReason: '',
                amhNotes: ''
            });
        }
        
        return data;
    }
};
