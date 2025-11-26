<template>
  <div class="about-us-page">
    <!-- Navbar Component -->
    <Navbar />
    
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Our Story</h1>
        <p>From a humble coffee cart in Calapan City to becoming Oriental Mindoro's favorite coffee destination</p>
        <a href="#story" class="btn" @click.prevent="scrollToSection('story')">Discover Our Journey</a>
      </div>
    </section>

    <!-- Our Story Section -->
    <section id="story" class="story-section">
      <div class="container">
        <div class="section-title">
          <h2>Our Humble Beginnings</h2>
          <p>How a simple dream became Oriental Mindoro's beloved coffee sanctuary</p>
        </div>
        
        <div class="story-content">
          <div class="story-text">
            <h2>From Coffee Cart to Community Hub</h2>
            <p>In 2022, Isla Cafe began as a small coffee cart in Calapan City, founded by Kurt Lyn Riño and her dedicated team Alyzza Myka M. Bernardo, Vanness Miguel Bacsa, and Jefferson Bala. As passionate 3rd-year college students, we shared a simple dream to brew meaningful connections through every cup of coffee.</p>
            <p>What started as a humble vision soon grew into a beloved community space, a place where warmth, stories, and smiles are shared over locally crafted coffee made with heart.</p>
            <p>Today, as we continue to grow across Oriental Mindoro and beyond, we remain rooted in our mission to serve coffee with purpose, foster genuine connections, and uplift local communities one cup at a time.</p>
          </div>
          <div class="story-image">
            <img src="/images/icafe.png" alt="Isla Cafe Story" @error="handleImageError" />
          </div>
        </div>
      </div>
    </section>

    <!-- Our Values Section -->
    <section class="values-section">
      <div class="container">
        <div class="section-title">
          <h2>Our Values</h2>
          <p>The principles that guide everything we do at Isla Cafe</p>
        </div>
        
        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon">
              <i class="fas fa-seedling"></i>
            </div>
            <h3>Sustainability</h3>
            <p>We source our coffee beans from local Mindoro farmers who practice sustainable agriculture, ensuring quality while protecting our beautiful island.</p>
          </div>
          
          <div class="value-card">
            <div class="value-icon">
              <i class="fas fa-heart"></i>
            </div>
            <h3>Community</h3>
            <p>We believe in creating spaces that bring people together, supporting local artists, and being an active part of the communities we serve.</p>
          </div>
          
          <div class="value-card">
            <div class="value-icon">
              <i class="fas fa-award"></i>
            </div>
            <h3>Quality</h3>
            <p>From bean to cup, we maintain the highest standards, ensuring every drink we serve is crafted with care and expertise.</p>
          </div>
          
          <div class="value-card">
            <div class="value-icon">
              <i class="fas fa-handshake"></i>
            </div>
            <h3>Authenticity</h3>
            <p>We stay true to our roots, celebrating Filipino coffee culture while creating innovative drinks that honor tradition.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline Section -->
    <section class="timeline-section">
      <div class="container">
        <div class="section-title">
          <h2>Our Journey</h2>
          <p>Milestones that shaped Isla Cafe into what it is today</p>
        </div>
        
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-year">2022</div>
            <div class="timeline-content">
              <h3>The Beginning</h3>
              <p>Isla Cafe started as a single coffee cart in Calapan City, serving traditional Filipino coffee with a modern twist.</p>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-year">2023</div>
            <div class="timeline-content">
              <h3>First Brick & Mortar</h3>
              <p>Opened our first physical location in Brgy. Ilaya, creating a cozy space for the community to gather.</p>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-year">2024</div>
            <div class="timeline-content">
              <h3>Expansion</h3>
              <p>Launched two new branches in Calapan City and began sourcing directly from local Mindoro coffee farmers.</p>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-year">2025</div>
            <div class="timeline-content">
              <h3>Beyond Mindoro</h3>
              <p>Expanded to Batangas City, bringing our unique coffee experience to new communities.</p>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-year">present</div>
            <div class="timeline-content">
              <h3>Growing Family</h3>
              <p>Opened our Makati branch and launched the Isla Cafe Foundation to support local coffee farmers.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="section-title">
          <h2>By The Numbers</h2>
          <p>Our impact in numbers</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-item">
            <h3>5</h3>
            <p>Branches</p>
          </div>
          
          <div class="stat-item">
            <h3>4+</h3>
            <p>Team Members</p>
          </div>
          
          <div class="stat-item">
            <h3>5</h3>
            <p>Local Farmers Supported</p>
          </div>
          
          <div class="stat-item">
            <h3>100+</h3>
            <p>Cups Served Daily</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <div class="container">
        <div class="section-title">
          <h2>Meet Our Team</h2>
          <p>The passionate people behind your favorite coffee experience</p>
        </div>
        
        <div class="team-grid">
          <div 
            v-for="member in teamMembers" 
            :key="member.id" 
            class="team-card"
            @click="openModal(member)"
          >
            <div class="team-image">
              <img :src="member.image" :alt="member.name" @error="handleImageError" />
            </div>
            <div class="team-info">
              <h3>{{ member.name }}</h3>
              <p class="role">{{ member.role }}</p>
              <p class="description">{{ member.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Modal -->
    <div 
      v-if="showModal"
      class="team-modal" 
      @click="closeModal"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ currentMember.name }}</h2>
          <span class="modal-close" @click="closeModal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="modal-image">
            <img :src="currentMember.image" :alt="currentMember.name" @error="handleImageError" />
          </div>
          <div class="modal-info">
            <h3>{{ currentMember.name }}</h3>
            <p class="role">{{ currentMember.role }}</p>
            <p class="member-description">{{ currentMember.description }}</p>
          </div>
          <div class="modal-contact">
            <h4>Connect with me</h4>
            <div class="social-icons">
              <a 
                v-for="social in currentMember.socials" 
                :key="social.platform"
                :href="social.url" 
                target="_blank"
                :class="['social-icon', getSocialClass(social.platform)]"
                @click.stop
              >
                <i :class="social.icon"></i>
              </a>
            </div>
            <div class="contact-details">
              <p class="contact-detail">
                <i class="fas fa-envelope"></i> {{ currentMember.contact.email }}
              </p>
              <p class="contact-detail">
                <i class="fas fa-phone"></i> {{ currentMember.contact.phone }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script>
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';

export default {
  name: 'AboutUs',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      showModal: false,
      currentMember: {
        name: '',
        role: '',
        description: '',
        image: '',
        socials: [],
        contact: {
          email: '',
          phone: ''
        }
      },
      teamMembers: [
        {
          id: 'kurt',
          name: 'Kurt Lyn Riño',
          role: 'Founder & CEO',
          description: 'Started Isla Cafe with a dream to share Filipino coffee culture with the world.',
          image: '/images/kurt.png',
          socials: [
            { platform: 'facebook', url: 'https://www.facebook.com/share/1M3jqXhUes/', icon: 'fab fa-facebook-f' },
            { platform: 'instagram', url: 'https://www.instagram.com/rinokurtlyn?igsh=MThidW84ZjJxMXp0Zw==', icon: 'fab fa-instagram' },
            { platform: 'tiktok', url: 'https://www.tiktok.com/@kray196?_t=ZS-90zOzxorDEO&_r=1', icon: 'fab fa-tiktok' }
          ],
          contact: {
            email: 'bbkurt21lr@gmail.com',
            phone: '+639918109490'
          }
        },
        {
          id: 'alyzza',
          name: 'Alyzza Myka Bernardo',
          role: 'Pastry Chef',
          description: 'Creates delicious treats that perfectly complement our coffee selections.',
          image: '/images/aly.png',
          socials: [
            { platform: 'facebook', url: 'https://www.facebook.com/alyuuuu/', icon: 'fab fa-facebook-f' },
            { platform: 'instagram', url: 'https://www.instagram.com/alyzza_myka?igsh=Y3JwOGh6Z3VjcTV5', icon: 'fab fa-instagram' },
            { platform: 'tiktok', url: 'https://www.tiktok.com/@hakuuuuu69?_t=ZS-90zOrG5DOZ6&_r=1', icon: 'fab fa-tiktok' }
          ],
          contact: {
            email: 'alyzzamyka@gmail.com',
            phone: '+639083550392'
          }
        },
        {
          id: 'vanness',
          name: 'Vanness Miguel Bacsa',
          role: 'Head Barista',
          description: '10 years of experience crafting the perfect cup of coffee with a smile.',
          image: '/images/bacsa.png',
          socials: [
            { platform: 'facebook', url: 'https://www.facebook.com/vannessmiguel.bacsa', icon: 'fab fa-facebook-f' },
            { platform: 'instagram', url: 'https://www.instagram.com/migsplosion', icon: 'fab fa-instagram' },
            { platform: 'tiktok', url: 'https://www.tiktok.com/en/', icon: 'fab fa-tiktok' }
          ],
          contact: {
            email: 'Tinysoda66@gmail.com',
            phone: '+639770126683'
          }
        },
        {
          id: 'jefferson',
          name: 'Jefferson Bala',
          role: 'Coffee Sourcing Manager',
          description: 'Works directly with local farmers to ensure we serve the finest beans.',
          image: '/images/bala.png',
          socials: [
            { platform: 'facebook', url: 'https://www.facebook.com/share/1H8yxzXf82/', icon: 'fab fa-facebook-f' },
            { platform: 'instagram', url: 'https://www.instagram.com/jeffersonbala.delacruz/?igsh=amwydG9neGVtM2Rx&fbclid=IwY2xjawNwn05leHRuA2FlbQIxMQABHguXQGkrRQcfauJLcUuA9wr6l2uSBsTkJrLdt8OwfhSH6-ZLDA026I_m5DGt_aem_vOnjDi4olWexYOz5pLULmg', icon: 'fab fa-instagram' },
            { platform: 'tiktok', url: 'https://www.tiktok.com/en/', icon: 'fab fa-tiktok' }
          ],
          contact: {
            email: 'cjaybala@gmail.com',
            phone: '+639924922445'
          }
        }
      ]
    }
  },
  methods: {
    openModal(member) {
      console.log('Opening modal for:', member.name);
      this.currentMember = { ...member };
      this.showModal = true;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    },
    closeModal() {
      console.log('Closing modal');
      this.showModal = false;
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    },
    getSocialClass(platform) {
      if (platform === 'facebook') return 'social-fb';
      if (platform === 'instagram') return 'social-ig';
      if (platform === 'tiktok') return 'social-tt';
      return '';
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    handleImageError(event) {
      console.log('Image failed to load:', event.target.src);
      // Set a fallback image or hide the broken image
      event.target.style.display = 'none';
      // Check if next element sibling exists before accessing it
      const nextSibling = event.target.nextElementSibling;
      if (nextSibling) {
        nextSibling.style.display = 'block'; // Show fallback if exists
      }
    },
    handleEscapeKey(event) {
      if (event.key === 'Escape' && this.showModal) {
        this.closeModal();
      }
    }
  },
  mounted() {
    console.log('AboutUs component mounted');
    // Add event listener for ESC key
    document.addEventListener('keydown', this.handleEscapeKey);
  },
  beforeUnmount() {
    // Clean up event listener
    document.removeEventListener('keydown', this.handleEscapeKey);
  }
}
</script>

<style scoped>
/* Color Variables - Light Mode */
:root {
  --beige: #f9f3ea;
  --light-beige: #fff8f0;
  --brown: #7e5a3c;
  --dark-brown: #5c3e1e;
  --gold: #dea02c;
  --light-gold: #ffe4b5;
  
  /* Base colors */
  --bg-primary: var(--beige);
  --bg-secondary: var(--light-beige);
  --text-primary: var(--dark-brown);
  --text-secondary: var(--brown);
  --accent-primary: var(--gold);
  --accent-secondary: var(--light-gold);
  --card-bg: white;
  --shadow-color: rgba(0, 0, 0, 0.05);
  --shadow-hover: rgba(0, 0, 0, 0.1);
  --modal-overlay: rgba(92, 62, 30, 0.9);
}

/* Dark Mode Variables */
[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #f0f0f0;
  --text-secondary: #d4b896;
  --accent-primary: #ffb347;
  --accent-secondary: #ffd699;
  --card-bg: #3d3d3d;
  --shadow-color: rgba(0, 0, 0, 0.3);
  --shadow-hover: rgba(0, 0, 0, 0.5);
  --modal-overlay: rgba(0, 0, 0, 0.9);
}

/* Base Styles */
.about-us-page {
  font-family: 'Arial', sans-serif;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  line-height: 1.6;
  min-height: 100vh;
  padding-top: 0;
  transition: all 0.3s ease;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero {
  background: linear-gradient(rgba(92, 62, 30, 0.7), rgba(92, 62, 30, 0.7)), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 0 20px;
}

[data-theme="dark"] .hero {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
}

.hero-content h1 {
  font-size: 2.2rem;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-content p {
  font-size: 1rem;
  margin-bottom: 25px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

/* Section Styles */
section {
  padding: 50px 0;
}

.section-title {
  text-align: center;
  margin-bottom: 40px;
}

.section-title h2 {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.section-title p {
  font-size: 1rem;
  color: var(--text-secondary);
  max-width: 500px;
  margin: 0 auto;
}

/* Story Section */
.story-content {
  display: flex;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
  
}

.story-text {
  flex: 1;
  min-width: 300px;
}

.story-text h2 {
  font-size: 1.6rem;
  color: var(--text-primary);
  margin-bottom: 15px;
}

.story-text p {
  margin-bottom: 15px;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.story-image {
  flex: 1;
  min-width: 300px;
  height: 300px;
  border-radius: 10px;
  box-shadow: 0 5px 15px var(--shadow-color);
  overflow: hidden;
}

.story-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* VALUES GRID */
.values-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.value-card {
  background-color: var(--card-bg);
  padding: 20px 15px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 3px 10px var(--shadow-color);
  transition: all 0.3s ease;
   border: 3px solid rgba(163, 122, 47, 0.897);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px var(--shadow-hover);
}

.value-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  color: rgb(219, 128, 23);
  font-size: 1.3rem;
}

.value-card h3 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 10px;
  font-weight: 600;
}

.value-card p {
  color: var(--text-secondary);
  line-height: 1.5;
  font-size: 0.85rem;
  margin: 0;
}

/* Timeline */
.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary));
  transform: translateX(-50%);
}

.timeline-item {
  display: flex;
  margin-bottom: 30px;
  position: relative;
}

.timeline-item:nth-child(odd) {
  flex-direction: row-reverse;
}

.timeline-year {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: rgba(209, 111, 19, 0.938);
  padding: 6px 15px;
  border-radius: 20px;
   border: 3px solid rgba(226, 155, 22, 0.897);
  font-weight: bold;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  font-size: 0.85rem;
}

.timeline-content {
  background-color: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 3px 10px var(--shadow-color);
  width: calc(50% - 30px);
  margin-top: 30px;
   border: 3px solid rgba(163, 122, 47, 0.897);
}

.timeline-item:nth-child(odd) .timeline-content {
  margin-left: 30px;
}

.timeline-item:nth-child(even) .timeline-content {
  margin-right: 30px;
}

.timeline-content h3 {
  color: var(--text-primary);
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.timeline-content p {
  color: var(--text-secondary);
  line-height: 1.5;
  font-size: 0.85rem;
  margin: 0;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 25px 15px;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 3px 10px var(--shadow-color);
  transition: all 0.3s ease;
  border: 1px solid rgba(222, 160, 44, 0.1);
}

.stat-item:hover {
  transform: translateY(-3px);
}

.stat-item h3 {
  font-size: 2.2rem;
  color: var(--accent-primary);
  margin-bottom: 8px;
  font-weight: 700;
}

.stat-item p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
}

/* TEAM GRID */
.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.team-card {
  background-color: var(--card-bg);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px var(--shadow-color);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 3px solid rgba(163, 122, 47, 0.897);
  height: 100%;
}

.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 25px var(--shadow-hover);
}

.team-image {
  height: 180px;
  overflow: hidden;
  background-color: var(--bg-secondary);
}

.team-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.team-card:hover .team-image img {
  transform: scale(1.1);
}

.team-info {
  padding: 15px;
  text-align: center;
}

.team-info h3 {
  color: var(--text-primary);
  margin-bottom: 5px;
  font-size: 1rem;
}

.team-info .role {
  color: var(--accent-primary);
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.team-info .description {
  color: var(--text-secondary);
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0;
}

/* Button */
.btn {
  display: inline-block;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  padding: 10px 25px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(222, 160, 44, 0.4);
}

/* Team Modal - FIXED */
.team-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--modal-overlay);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background-color: var(--card-bg);
  border-radius: 15px;
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  animation: modalSlideIn 0.3s ease;
  border: 2px solid var(--accent-primary);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  background: linear-gradient(135deg, var(--text-secondary), var(--accent-primary));
  color: white;
  padding: 20px;
  text-align: center;
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 1.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  background: none;
  border: none;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.modal-close:hover {
  transform: rotate(90deg);
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.modal-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--accent-secondary);
  box-shadow: 0 5px 15px var(--shadow-color);
  background-color: var(--bg-secondary);
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-info {
  text-align: center;
  width: 100%;
}

.modal-info h3 {
  color: var(--text-primary);
  font-size: 1.3rem;
  margin-bottom: 8px;
  font-weight: 700;
}

.modal-info .role {
  font-weight: 600;
  color: var(--accent-primary);
  font-size: 1rem;
  margin-bottom: 12px;
}

.member-description {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.9rem;
  margin: 0;
}

.modal-contact {
  width: 100%;
  text-align: center;
  border-top: 1px solid rgba(222, 160, 44, 0.3);
  padding-top: 20px;
}

.modal-contact h4 {
  color: var(--text-primary);
  margin-bottom: 15px;
  font-size: 1.1rem;
  font-weight: 600;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-decoration: none;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  color: white;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}

.social-icon:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.social-fb {
  background: #3b5998;
}
.social-ig {
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
}
.social-tt {
  background: #000000;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-detail {
  color: var(--text-secondary);
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  padding: 5px 0;
}

.contact-detail i {
  color: var(--accent-primary);
  width: 16px;
}

/* Stats Section */
.stats-section {
  position: relative;
  background-image: url('/images/branch5.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.stats-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.stats-section .container {
  position: relative;
  z-index: 1;
}

.stats-section .section-title h2 {
  color: #ffffff;
}

.stats-section .section-title p {
  color: #f0f0f0;
}

.stat-item {
  background-color: rgba(255, 255, 255, 0.95);
  border: 2px solid #dea02c;
}

.stat-item h3 {
  color: #7e5a3c;
}

.stat-item p {
  color: #5c3e1e;
}

.stat-item:hover {
  background-color: rgba(255, 255, 255, 1);
  border-color: #ffb347;
}

.stat-item:hover h3 {
  color: #5c3e1e;
}

/* Dark mode support for stats */
[data-theme="dark"] .stats-section .section-title h2 {
  color: #ffdcba;
}

[data-theme="dark"] .stats-section .section-title p {
  color: #d4b896;
}

[data-theme="dark"] .stat-item {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #ffb347;
}

[data-theme="dark"] .stat-item h3 {
  color: #ffb347;
}

[data-theme="dark"] .stat-item p {
  color: #d4b896;
}

[data-theme="dark"] .stat-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .values-grid,
  .stats-grid,
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero {
    height: 60vh;
  }
  
  .hero-content h1 {
    font-size: 1.8rem;
  }
  
  .section-title h2 {
    font-size: 1.6rem;
  }
  
  .story-content {
    flex-direction: column;
  }
  
  .timeline::before {
    left: 30px;
  }
  
  .timeline-item {
    flex-direction: row !important;
  }
  
  .timeline-year {
    left: 30px;
    transform: translateX(0);
  }
  
  .timeline-content {
    width: calc(100% - 60px);
    margin-left: 60px !important;
    margin-right: 0 !important;
  }
  
  .values-grid,
  .stats-grid,
  .team-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    max-width: 95%;
    margin: 20px;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 1.5rem;
  }
  
  .container {
    padding: 0 15px;
  }
  
  section {
    padding: 40px 0;
  }
  
  .modal-content {
    max-width: 95%;
    margin: 10px;
  }

  .modal-body {
    padding: 20px;
  }

  .social-icons {
    gap: 8px;
  }

  .social-icon {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
}
</style>