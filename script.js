// Enhanced notification system for Gracious Fast Food
class FoodNotifier {
    constructor() {
        this.foodTimes = ['07:30', '10:00', '12:30', '14:00', '15:30', '16:00'];
        this.notifiedToday = [];
        this.initialized = false;
        this.notificationStatus = document.getElementById('notification-status');
    }

    // Request notification permission
    async initialize() {
        if (!('Notification' in window)) {
            this.updateStatus('❌ Your browser does not support notifications', 'error');
            return false;
        }

        if (Notification.permission === 'default') {
            this.updateStatus('🔔 Click "Test Notification" to enable food alerts', 'info');
            return false;
        } else if (Notification.permission === 'granted') {
            this.initialized = true;
            this.startMonitoring();
            this.updateStatus('✅ Food notifications are active! You\'ll be alerted when food is ready.', 'success');
            return true;
        } else {
            this.updateStatus('❌ Notifications blocked. Please enable in browser settings.', 'error');
            return false;
        }
    }

    // Update status display
    updateStatus(message, type) {
        if (this.notificationStatus) {
            this.notificationStatus.innerHTML = `
                <span class="status-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : '🔔'}</span>
                <span>${message}</span>
            `;
        }
    }

    // Start checking for food times
    startMonitoring() {
        // Check immediately
        this.checkFoodTime();
        
        // Check every minute
        setInterval(() => {
            this.checkFoodTime();
        }, 60000);
        
        // Reset daily at midnight
        this.setupDailyReset();
        
        console.log('🍽️ Food notification monitor started!');
    }

    // Check if it's food time
    checkFoodTime() {
        const now = new Date();
        const currentTime = now.toTimeString().substring(0, 5);
        const today = now.toDateString();

        // If it's a food time and we haven't notified today
        if (this.foodTimes.includes(currentTime) && 
            !this.notifiedToday.includes(currentTime)) {
            
            this.showNotification();
            this.notifiedToday.push(currentTime);
            console.log(`🔔 Food notification sent for ${currentTime}`);
        }
    }

    // Show the notification
    showNotification() {
        if (!this.initialized) return;

        const notification = new Notification('🍽️ GRACIOUS FAST FOOD - FOOD IS READY!', {
            body: '🎯 You can call +2347068071343 now to make enquiry or place your order.\n\n📞 Call: +2347068071343\n💬 WhatsApp: +2347068071343\n\nThanks for your patronage! ❤️',
            icon: 'logo.png',
            tag: 'food-ready',
            requireInteraction: true,
            badge: 'logo.png'
        });

        // Play sound if available
        this.playNotificationSound();

        // Close after 15 seconds
        setTimeout(() => {
            notification.close();
        }, 15000);

        // Handle notification click
        notification.onclick = function() {
            window.open('tel:+2347068071343', '_self');
            notification.close();
        };
    }

    // Play notification sound
    playNotificationSound() {
        try {
            // Simple beep sound using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Sound not supported');
        }
    }

    // Reset notifications daily
    setupDailyReset() {
        const now = new Date();
        const night = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1, // next day
            0, 0, 0 // midnight
        );
        
        const timeToMidnight = night.getTime() - now.getTime();
        
        setTimeout(() => {
            this.notifiedToday = [];
            this.setupDailyReset(); // reset again next day
            console.log('🔄 Daily notification reset completed');
        }, timeToMidnight);
    }

    // Manual test notification
    async testNotification() {
        if (!('Notification' in window)) {
            alert('Your browser does not support notifications. Please use Chrome, Firefox, or Edge.');
            return;
        }

        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                this.initialized = true;
                this.startMonitoring();
                this.updateStatus('✅ Notifications enabled! Testing food alert...', 'success');
                
                // Show test notification after a delay
                setTimeout(() => {
                    this.showTestNotification();
                }, 1000);
            } else {
                this.updateStatus('❌ Notifications blocked. Please allow to receive food alerts.', 'error');
            }
        } else if (Notification.permission === 'granted') {
            this.showTestNotification();
        } else {
            alert('Notifications are blocked. Please enable them in your browser settings to receive food alerts.');
        }
    }

    // Show test notification
    showTestNotification() {
        const testNotification = new Notification('🍽️ GRACIOUS FAST FOOD - TEST NOTIFICATION', {
            body: '✅ Notifications are working perfectly!\n\nYou will receive alerts when food is ready at:\n• 7:30 AM • 10:00 AM • 12:30 PM\n• 2:00 PM • 3:30 PM • 4:00 PM\n\n📞 Call +2347068071343 to order!',
            icon: 'logo.png',
            requireInteraction: true
        });

        // Close after 10 seconds
        setTimeout(() => {
            testNotification.close();
        }, 10000);

        // Click to call
        testNotification.onclick = function() {
            window.open('tel:+2347068071343', '_self');
            testNotification.close();
        };
    }
}

// Restaurant information
const restaurantInfo = {
    phone: '+2347068071343',
    whatsapp: '+2347068071343',
    location: 'Gracious Fast Food beside Overcomers Church Agbaja Road Felele Lokoja'
};

// Initialize the notifier
const foodNotifier = new FoodNotifier();

// Other restaurant functions
function openDirections() {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantInfo.location)}`;
    window.open(url, '_blank');
}

function callRestaurant() {
    window.open(`tel:${restaurantInfo.phone}`, '_self');
}

function openWhatsApp() {
    const message = 'Hello! I would like to place an order from Gracious Fast Food.';
    const url = `https://wa.me/${restaurantInfo.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Start when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Auto-initialize notifications
    setTimeout(() => {
        foodNotifier.initialize();
    }, 2000);
    
    console.log('🏪 Gracious Fast Food website loaded successfully!');
});