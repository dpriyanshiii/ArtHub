// js/events-loader.js

class EventsLoader {
    constructor() {
        this.events = [];
        this.filteredEvents = [];
    }

    async loadEvents() {
        try {
            const response = await fetch('data/events.json');
            const data = await response.json();
            this.events = data.events;
            this.filteredEvents = [...this.events];
            return this.events;
        } catch (error) {
            console.error('Error loading events:', error);
            this.events = this.getSampleEvents();
            this.filteredEvents = [...this.events];
            return this.events;
        }
    }

    getSampleEvents() {
        return [
            {
                id: 1,
                title: "Renaissance Revisited",
                description: "A contemporary reinterpretation of Renaissance masterpieces by emerging artists.",
                date: "June 15-30, 2025",
                time: "10:00 AM - 6:00 PM Daily",
                location: "Grand Art Gallery, Florence",
                price: "€15 (Students €10)",
                type: "exhibition",
                buttons: [
                    { text: "Book Tickets", class: "btn-primary", icon: "fas fa-ticket-alt" },
                    { text: "More Details", class: "btn-secondary", icon: "fas fa-info-circle" }
                ]
            }
        ];
    }

    displayEvents() {
        const timelineContainer = document.querySelector('.events-timeline');
        
        if (!timelineContainer) {
            console.error('Events timeline container not found');
            return;
        }

        timelineContainer.innerHTML = this.filteredEvents.map(event => this.createEventCard(event)).join('');
        this.addEventListeners();
    }

    createEventCard(event) {
        return `
            <div class="event-card" data-event-id="${event.id}" data-event-type="${event.type}">
                <div class="event-date">
                    <i class="far fa-calendar-alt"></i> ${event.date}
                </div>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-details">
                    <div class="event-detail">
                        <i class="fas fa-map-marker-alt"></i> ${event.location}
                    </div>
                    <div class="event-detail">
                        <i class="fas fa-clock"></i> ${event.time}
                    </div>
                    <div class="event-detail">
                        <i class="fas fa-euro-sign"></i> ${event.price}
                    </div>
                </div>
                <div class="event-actions">
                    ${event.buttons.map(button => `
                        <a href="#" class="btn-event ${button.class}" data-action="${button.text.toLowerCase()}">
                            <i class="${button.icon}"></i> ${button.text}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    filterEvents(type) {
        if (type === 'all') {
            this.filteredEvents = [...this.events];
        } else {
            this.filteredEvents = this.events.filter(event => event.type === type);
        }
        this.displayEvents();
    }

    searchEvents(query) {
        if (!query) {
            this.filteredEvents = [...this.events];
        } else {
            const lowerQuery = query.toLowerCase();
            this.filteredEvents = this.events.filter(event => 
                event.title.toLowerCase().includes(lowerQuery) ||
                event.description.toLowerCase().includes(lowerQuery) ||
                event.location.toLowerCase().includes(lowerQuery)
            );
        }
        this.displayEvents();
    }

    addEventListeners() {
        document.querySelectorAll('.btn-event').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const action = e.target.closest('.btn-event').getAttribute('data-action');
                const eventCard = e.target.closest('.event-card');
                const eventId = eventCard.getAttribute('data-event-id');
                const eventTitle = eventCard.querySelector('.event-title').textContent;
                
                this.handleEventAction(action, eventId, eventTitle);
            });
        });
    }

    handleEventAction(action, eventId, eventTitle) {
        const event = this.events.find(e => e.id == eventId);
        
        switch(action) {
            case 'book tickets':
            case 'register now':
            case 'view schedule':
                alert(`Booking functionality for: ${event.title}\n\nThis would connect to your booking system!`);
                break;
            case 'more details':
            case 'workshop details':
            case 'event guide':
                alert(`Event Details:\n\n${event.title}\n\nDate: ${event.date}\nTime: ${event.time}\nLocation: ${event.location}\nPrice: ${event.price}\n\n${event.description}`);
                break;
            default:
                console.log(`Action: ${action} for event: ${eventTitle}`);
        }
    }

    addFilterControls() {
        const eventsContainer = document.querySelector('.events-container');
        const existingFilter = document.querySelector('.events-filter');
        
        if (existingFilter) return;

        const filterHtml = `
            <div class="events-filter">
                <div class="search-box">
                    <input type="text" id="eventSearch" placeholder="Search events...">
                    <i class="fas fa-search"></i>
                </div>
                <div class="filter-buttons">
                    <button class="filter-btn active" data-filter="all">All Events</button>
                    <button class="filter-btn" data-filter="exhibition">Exhibitions</button>
                    <button class="filter-btn" data-filter="workshop">Workshops</button>
                    <button class="filter-btn" data-filter="festival">Festivals</button>
                </div>
            </div>
        `;

        const timeline = document.querySelector('.events-timeline');
        eventsContainer.insertBefore(this.createElementFromHTML(filterHtml), timeline);
        this.addFilterListeners();
    }

    createElementFromHTML(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

    addFilterListeners() {
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                const filter = e.target.getAttribute('data-filter');
                this.filterEvents(filter);
            });
        });

        const searchInput = document.getElementById('eventSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchEvents(e.target.value);
            });
        }
    }

    async init() {
        await this.loadEvents();
        this.addFilterControls();
        this.displayEvents();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const eventsLoader = new EventsLoader();
    eventsLoader.init();
});