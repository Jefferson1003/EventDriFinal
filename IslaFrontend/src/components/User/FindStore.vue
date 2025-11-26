<template>
  <div id="app" class="compact-container">
    <!-- Navbar Component -->
    <Navbar />

    <!-- Compact Sidebar with Dark Brown Background -->
    <div class="compact-sidebar">
      <h2>Store Branches</h2>

      <ul class="nav-links">
        <li>
          <a href="#calapan-city" :class="{ active: activeCategory === 'calapan-city' }" 
             @click.prevent="setActiveCategory('calapan-city')">
            <i class="fas fa-map-marker-alt"></i> Calapan City
          </a>
          <ul id="calapan-city-submenu" class="sub-menu" :class="{ active: activeCategory === 'calapan-city' }">
            <li><a href="#ilaya" @click.prevent="showStore('ilaya')">Brgy. Ilaya</a></li>
            <li><a href="#masipit" @click.prevent="showStore('masipit')">Brgy. Masipit</a></li>
            <li><a href="#roxas-calapan" @click.prevent="showStore('roxas-calapan')">Roxas Drive</a></li>
          </ul>
        </li>

        <li>
          <a href="#nearby-cities" :class="{ active: activeCategory === 'nearby-cities' }" 
             @click.prevent="setActiveCategory('nearby-cities')">
            <i class="fas fa-city"></i> Nearby Cities
          </a>
          <ul id="nearby-cities-submenu" class="sub-menu" :class="{ active: activeCategory === 'nearby-cities' }">
            <li><a href="#makati" @click.prevent="showStore('makati')">Makati City</a></li>
            <li><a href="#batangas" @click.prevent="showStore('batangas')">Batangas City</a></li>
          </ul>
        </li>

        <li>
          <a href="#coming-soon" :class="{ active: activeCategory === 'coming-soon' }" 
             @click.prevent="setActiveCategory('coming-soon')">
            <i class="fas fa-hard-hat"></i> Coming Soon
          </a>
          <ul id="coming-soon-submenu" class="sub-menu" :class="{ active: activeCategory === 'coming-soon' }">
            <li><a href="#tanza" @click.prevent="showStore('tanza')">Tanza, Cavite</a></li>
          </ul>
        </li>
      </ul>

      <!-- Quick Store Info Widget -->
      <div class="store-widget">
        <h3>Store Hours</h3>
        <div class="store-hours">
          <div class="hour-item">
            <span>Mon - Fri</span>
            <span>6:00 AM - 10:00 PM</span>
          </div>
          <div class="hour-item">
            <span>Saturday</span>
            <span>6:30 AM - 11:00 PM</span>
          </div>
          <div class="hour-item">
            <span>Sunday</span>
            <span>7:00 AM - 9:00 PM</span>
          </div>
        </div>
        <div class="store-contact">
          <p><i class="fas fa-phone"></i> +639083550392</p>
          <p><i class="fas fa-envelope"></i> islacafecalapan@gmail.com</p>
        </div>
      </div>
    </div>

    <div class="title-image-section">
       <img src="/public/images/branch3.png" alt="Store Image" class="title-image">
      <h1 class="overlay-text">Find Your Nearest Store</h1>
      
    </div> 

    <!-- Main Content -->
    <div class="compact-main">
      <!-- Store Details and Map Section -->
      <div class="main-content-grid">
        <!-- Store Details -->
        <div class="store-details-compact">
          <!-- Ilaya Branch -->
          <div class="store-card-compact" :class="{ active: currentStore === 'ilaya' }" id="ilaya-store">
            <div class="store-header-compact">
              <h3 class="store-name-compact">ISLA CAFE - Brgy. Ilaya Main</h3>
              <div class="store-badge-compact main">Main Branch</div>
            </div>
            <div class="store-image-compact" @click="openStoreImage('ilaya')">
              <img src="/public/images/branch2.png" alt="Brgy. Ilaya Store">
            </div>
            <div class="store-info-compact">
              <div class="info-item-compact">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                  <strong>Address</strong>
                  <p>Brgy. Ilaya, Calapan City, Oriental Mindoro</p>
                </div>
              </div>
              <div class="info-item-compact">
                <i class="fas fa-phone"></i>
                <div>
                  <strong>Contact</strong>
                  <p>+639083550392</p>
                </div>
              </div>
              <div class="info-item-compact">
                <i class="fas fa-clock"></i>
                <div>
                  <strong>Hours</strong>
                  <p>Mon-Sun: 6:00 AM - 10:00 PM</p>
                </div>
              </div>
              <div class="info-item-compact">
                <i class="fas fa-wifi"></i>
                <div>
                  <strong>Amenities</strong>
                  <div class="amenities-compact">
                    <span class="amenity-tag-compact">Free WiFi</span>
                    <span class="amenity-tag-compact">Parking</span>
                    <span class="amenity-tag-compact">Outdoor</span>
                    <span class="amenity-tag-compact">AC Rooms</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="store-actions-compact">
              <button class="action-btn-compact primary" @click="callStore('+639083550392')">
                <i class="fas fa-phone"></i> Call
              </button>
              <button class="action-btn-compact" @click="getDirections('ilaya')">
                <i class="fas fa-directions"></i> Directions
              </button>
              <button class="action-btn-compact" @click="shareStore('ilaya')">
                <i class="fas fa-share-alt"></i> Share
              </button>
            </div>
          </div>

          <!-- Masipit Branch -->
          <div class="store-card-compact" :class="{ active: currentStore === 'masipit' }" id="masipit-store">
            <div class="store-header-compact">
              <h3 class="store-name-compact">ISLA CAFE - Brgy. Masipit</h3>
              <div class="store-badge-compact">Express</div>
            </div>
            <div class="store-image-compact" @click="openStoreImage('masipit')">
              <img src="/public/images/branch3.png" alt="Masipit Store">
            </div>
            <div class="store-info-compact">
              <div class="info-item-compact">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                  <strong>Address</strong>
                  <p>Brgy. Masipit, Calapan City, Oriental Mindoro</p>
                </div>
              </div>
              <div class="info-item-compact">
                <i class="fas fa-phone"></i>
                <div>
                  <strong>Contact</strong>
                  <p>+639083550392</p>
                </div>
              </div>
              <div class="info-item-compact">
                <i class="fas fa-clock"></i>
                <div>
                  <strong>Hours</strong>
                  <p>Mon-Sun: 5:30 AM - 9:00 PM</p>
                </div>
              </div>
              <div class="info-item-compact">
                <i class="fas fa-wifi"></i>
                <div>
                  <strong>Amenities</strong>
                  <div class="amenities-compact">
                    <span class="amenity-tag-compact">Free WiFi</span>
                    <span class="amenity-tag-compact">Drive-thru</span>
                    <span class="amenity-tag-compact">Takeout</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="store-actions-compact">
              <button class="action-btn-compact primary" @click="callStore('+639083550392')">
                <i class="fas fa-phone"></i> Call
              </button>
              <button class="action-btn-compact" @click="getDirections('masipit')">
                <i class="fas fa-directions"></i> Directions
              </button>
            </div>
          </div>

          <!-- Roxas Branch -->
          <div class="store-card-compact" :class="{ active: currentStore === 'roxas-calapan' }" id="roxas-calapan-store">
            <div class="store-header-compact">
              <h3 class="store-name-compact">ISLA CAFE - Roxas Drive</h3>
              <div class="store-badge-compact">City Center</div>
            </div>
            <div class="store-image-compact" @click="openStoreImage('roxas-calapan')">
              <img src="/public/images/branch4.png" alt="Roxas Calapan Store">
            </div>
            <div class="store-info-compact">
              <div class="info-item-compact">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                  <strong>Address</strong>
                  <p>Roxas Drive, Calapan City, Oriental Mindoro</p>
                </div>
              </div>
              <div class="info-item-compact">
                <i class="fas fa-phone"></i>
                <div>
                  <strong>Contact</strong>
                  <p>+639083550392</p>
                </div>
              </div>
              <div class="info-item-compact">
                <i class="fas fa-clock"></i>
                <div>
                  <strong>Hours</strong>
                  <p>Mon-Sun: 6:30 AM - 11:00 PM</p>
                </div>
              </div>
              <div class="info-item-compact">
                <i class="fas fa-wifi"></i>
                <div>
                  <strong>Amenities</strong>
                  <div class="amenities-compact">
                    <span class="amenity-tag-compact">Free WiFi</span>
                    <span class="amenity-tag-compact">Parking</span>
                    <span class="amenity-tag-compact">Live Music</span>
                    <span class="amenity-tag-compact">AC Rooms</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="store-actions-compact">
              <button class="action-btn-compact primary" @click="callStore('+639083550392')">
                <i class="fas fa-phone"></i> Call
              </button>
              <button class="action-btn-compact" @click="getDirections('roxas-calapan')">
                <i class="fas fa-directions"></i> Directions
              </button>
            </div>
          </div>

          <!-- Makati Branch -->
          <div class="store-card-compact" :class="{ active: currentStore === 'makati' }" id="makati-store">
            <div class="store-header-compact">
              <h3 class="store-name-compact">ISLA CAFE - Makati Avenue</h3>
              <div class="store-badge-compact">Metro Manila</div>
            </div>
            <div class="store-image-compact" @click="openStoreImage('makati')">
              <img src="/public/images/branch5.png" alt="Makati Store">
            </div>
            <div class="store-info-compact">
              <div class="info-item-compact">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                  <strong>Address</strong>
                  <p>Makati Avenue, Makati City, Metro Manila</p>
                </div>
              </div>
              <div class="info-item-compact">
                <i class="fas fa-phone"></i>
                <div>
                  <strong>Contact</strong>
                  <p>+639083550392</p>
                </div>
              </div>
              <div class="info-item-compact">
                <i class="fas fa-clock"></i>
                <div>
                  <strong>Hours</strong>
                  <p>Mon-Sun: 7:00 AM - 11:00 PM</p>
                </div>
              </div>
              <div class="info-item-compact">
                <i class="fas fa-wifi"></i>
                <div>
                  <strong>Amenities</strong>
                  <div class="amenities-compact">
                    <span class="amenity-tag-compact">Free WiFi</span>
                    <span class="amenity-tag-compact">Parking</span>
                    <span class="amenity-tag-compact">AC Rooms</span>
                    <span class="amenity-tag-compact">Conference</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="store-actions-compact">
              <button class="action-btn-compact primary" @click="callStore('+639083550392')">
                <i class="fas fa-phone"></i> Call
              </button>
              <button class="action-btn-compact" @click="getDirections('makati')">
                <i class="fas fa-directions"></i> Directions
              </button>
            </div>
          </div>

          <!-- Batangas Branch -->
          <div class="store-card-compact" :class="{ active: currentStore === 'batangas' }" id="batangas-store">
            <div class="store-header-compact">
              <h3 class="store-name-compact">ISLA CAFE - Batangas City</h3>
              <div class="store-badge-compact">Batangas</div>
            </div>
            <div class="store-image-compact" @click="openStoreImage('batangas')">
              <img src="/public/images/branch1.png" alt="Batangas Store">
            </div>
            <div class="store-info-compact">
              <div class="info-item-compact">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                  <strong>Address</strong>
                  <p>P. Burgos Street, Batangas City, Batangas</p>
                </div>
              </div>
              <div class="info-item-compact">
                <i class="fas fa-phone"></i>
                <div>
                  <strong>Contact</strong>
                  <p>+639083550392</p>
                </div>
              </div>
              <div class="info-item-compact">
                <i class="fas fa-clock"></i>
                <div>
                  <strong>Hours</strong>
                  <p>Mon-Sun: 6:30 AM - 10:00 PM</p>
                </div>
              </div>
              <div class="info-item-compact">
                <i class="fas fa-wifi"></i>
                <div>
                  <strong>Amenities</strong>
                  <div class="amenities-compact">
                    <span class="amenity-tag-compact">Free WiFi</span>
                    <span class="amenity-tag-compact">Parking</span>
                    <span class="amenity-tag-compact">Drive-thru</span>
                    <span class="amenity-tag-compact">Outdoor</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="store-actions-compact">
              <button class="action-btn-compact primary" @click="callStore('+639083550392')">
                <i class="fas fa-phone"></i> Call
              </button>
              <button class="action-btn-compact" @click="getDirections('batangas')">
                <i class="fas fa-directions"></i> Directions
              </button>
            </div>
          </div>

          <!-- Tanza Coming Soon Branch -->
          <div class="store-card-compact" :class="{ active: currentStore === 'tanza' }" id="tanza-store">
            <div class="store-header-compact">
              <h3 class="store-name-compact">ISLA CAFE - Tanza Cavite</h3>
              <div class="store-badge-compact">Coming Soon</div>
            </div>
            <div class="store-image-compact" @click="openStoreImage('tanza')">
              <img src="/public/images/branch4.png" alt="Tanza Store">
            </div>
            <div class="store-info-compact">
              <div class="info-item-compact">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                  <strong>Address</strong>
                  <p>Tanza City Proper, Cavite</p>
                </div>
              </div>
              <div class="info-item-compact">
                <i class="fas fa-phone"></i>
                <div>
                  <strong>Contact</strong>
                  <p>—</p>
                </div>
              </div>
              <div class="info-item-compact">
                <i class="fas fa-clock"></i>
                <div>
                  <strong>Hours</strong>
                  <p>Opening Soon!</p>
                </div>
              </div>
              <div class="info-item-compact">
                <i class="fas fa-info-circle"></i>
                <div>
                  <strong>Status</strong>
                  <p>New branch opening soon in Tanza, Cavite!</p>
                </div>
              </div>
            </div>
            <div class="store-actions-compact">
              <button class="action-btn-compact" disabled>
                <i class="fas fa-phone"></i> Coming Soon
              </button>
              <button class="action-btn-compact" @click="showComingSoon('tanza')">
                <i class="fas fa-bell"></i> Notify Me
              </button>
            </div>
          </div>
        </div>

        <!-- Map Container -->
        <div class="map-section-compact">
          <div class="map-header">
            <h3>Store Locations</h3>
            <div class="map-controls-compact">
              <button class="map-control-btn-compact" @click="centerMap">
                <i class="fas fa-crosshairs"></i>
                <span>Center</span>
              </button>
              <button class="map-control-btn-compact" @click="getDirections(currentStore)">
                <i class="fas fa-route"></i>
                <span>Directions</span>
              </button>
            </div>
          </div>
          <div id="storeMap"></div>
        </div>
      </div>

      <!-- Other Stores Section -->
      <div class="other-stores-section">
        <div class="other-title-image">
          <img src="/public/images/branch5.png" alt="Makati Store">
          <div class="overlay-text">Our Branches Around You</div>
        </div>
        <div class="other-stores-grid">
          <div class="other-store-card">
            <div class="other-store-image" @click="openOtherStoreImage('/public/images/branch2.png', 'Makati City')">
              <img src="/public/images/branch5.png" alt="Makati Store">
            </div>
            <div class="other-store-info">
              <h4>Makati City</h4>
              <p><i class="fas fa-map-marker-alt"></i> Makati Avenue, Metro Manila</p>
              <p><i class="fas fa-clock"></i> 7:00 AM - 11:00 PM</p>
              <p><i class="fas fa-phone"></i> +639083550392</p>
            </div>
          </div>

          <div class="other-store-card">
            <div class="other-store-image" @click="openOtherStoreImage('/public/images/branch3.png', 'Batangas City')">
              <img src="/public/images/branch1.png" alt="Batangas Store">
            </div>
            <div class="other-store-info">
              <h4>Batangas City</h4>
              <p><i class="fas fa-map-marker-alt"></i> P. Burgos Street, Batangas</p>
              <p><i class="fas fa-clock"></i> 6:30 AM - 10:00 PM</p>
              <p><i class="fas fa-phone"></i> +639083550392</p>
            </div>
          </div>

          <div class="other-store-card coming-soon">
            <div class="other-store-image" @click="openOtherStoreImage('/public/images/branch4.png', 'Tanza Cavite')">
              <img src="/public/images/branch4.png" alt="Tanza Store">
            </div>
            <div class="other-store-info">
              <h4>Tanza, Cavite <span class="coming-soon-badge">Coming Soon</span></h4>
              <p><i class="fas fa-map-marker-alt"></i> Tanza City Proper, Cavite</p>
              <p><i class="fas fa-clock"></i> Opening Soon!</p>
              <p><i class="fas fa-phone"></i> —</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div id="imageModal" class="image-modal" :class="{ active: isModalActive }" @click="closeModal">
      <span class="close-modal" @click="closeModal">&times;</span>
      <img class="modal-content" id="modalImage" :src="modalImageSrc" :alt="modalImageAlt" @click.stop>
      <div class="modal-caption" id="modalCaption">{{ modalImageCaption }}</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import Navbar from './Navbar.vue'

export default {
  name: 'FindStore',
  components: {
    Navbar
  },
  setup() {
    // Reactive data
    const currentStore = ref('ilaya')
    const activeCategory = ref('calapan-city')
    const map = ref(null)
    const markers = ref([])
    const modalImageSrc = ref('')
    const modalImageAlt = ref('')
    const modalImageCaption = ref('')
    const isModalActive = ref(false)

    // Stores data
    const stores = ref({
      'ilaya': {
        name: 'ISLA CAFE - Brgy. Ilaya Main',
        address: 'Brgy. Ilaya, Calapan City, Oriental Mindoro',
        phone: '+639083550392',
        position: { lat: 13.4143, lng: 121.1805 },
        type: 'main',
        category: 'calapan-city',
        image: '/public/images/branch2.png'
      },
      'masipit': {
        name: 'ISLA CAFE - Brgy. Masipit',
        address: 'Brgy. Masipit, Calapan City, Oriental Mindoro',
        phone: '+639083550392',
        position: { lat: 13.4120, lng: 121.1820 },
        type: 'standard',
        category: 'calapan-city',
        image: '/public/images/branch3.png'
      },
      'roxas-calapan': {
        name: 'ISLA CAFE - Roxas Drive',
        address: 'Roxas Drive, Calapan City, Oriental Mindoro',
        phone: '+639083550392',
        position: { lat: 13.4160, lng: 121.1780 },
        type: 'standard',
        category: 'calapan-city',
        image: '/public/images/branch4.png'
      },
      'makati': {
        name: 'ISLA CAFE - Makati Avenue',
        address: 'Makati Avenue, Makati City, Metro Manila',
        phone: '+639083550392',
        position: { lat: 14.5547, lng: 121.0244 },
        type: 'standard',
        category: 'nearby-cities',
        image: '/public/images/branch5.png'
      },
      'batangas': {
        name: 'ISLA CAFE - Batangas City',
        address: 'P. Burgos Street, Batangas City, Batangas',
        phone: '+639083550392',
        position: { lat: 13.7565, lng: 121.0583 },
        type: 'standard',
        category: 'nearby-cities',
        image: '/public/images/branch1.png'
      },
      'tanza': {
        name: 'ISLA CAFE - Tanza Cavite',
        address: 'Tanza City Proper, Cavite',
        phone: '—',
        position: { lat: 14.3941, lng: 120.8530 },
        type: 'coming-soon',
        category: 'coming-soon',
        image: '/public/images/branch4.png'
      }
    })

    // Methods
    const openModal = (imageSrc, imageAlt, caption = '') => {
      modalImageSrc.value = imageSrc
      modalImageAlt.value = imageAlt
      modalImageCaption.value = caption
      isModalActive.value = true
      document.body.style.overflow = 'hidden'
    }

    const closeModal = () => {
      isModalActive.value = false
      document.body.style.overflow = 'auto'
    }

    const openStoreImage = (storeId) => {
      const store = stores.value[storeId]
      if (store && store.image) {
        openModal(store.image, store.name, store.name)
      }
    }

    const openOtherStoreImage = (imageSrc, storeName) => {
      openModal(imageSrc, storeName, storeName)
    }

    const setActiveCategory = (category) => {
      // Toggle the category - if clicking the same category, close it
      if (activeCategory.value === category) {
        activeCategory.value = null
      } else {
        activeCategory.value = category
      }
    }

    const showStore = (storeId) => {
      currentStore.value = storeId
      
      // Update map center based on store
      if (stores.value[storeId].position && map.value) {
        map.value.setCenter(stores.value[storeId].position)
        map.value.setZoom(16)
      }
      
      // Add marker for this store if it's not already on the map
      if (!markers.value.find(m => m.title === stores.value[storeId].name)) {
        addStoreMarker(stores.value[storeId])
      }
    }

    const showComingSoon = (city) => {
      showNotification(`${city} branch coming soon! We're excited to serve you there.`)
      showStore(city)
    }

    const initMap = () => {
      if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        console.error('Google Maps API failed to load')
        showNotification('Maps service temporarily unavailable. Please check your API key.')
        return
      }

      const mapElement = document.getElementById('storeMap')
      if (!mapElement) {
        console.error('Map container element not found')
        return
      }

      try {
        const ilayaLocation = stores.value.ilaya.position
        
        map.value = new google.maps.Map(mapElement, {
          zoom: 15,
          center: ilayaLocation,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }]
            }
          ]
        })

        // Add markers for all stores
        Object.values(stores.value).forEach(store => {
          addStoreMarker(store)
        })
        
        console.log('Google Maps initialized successfully')
        
      } catch (error) {
        console.error('Error initializing Google Maps:', error)
        showNotification('Error loading map. Please try again later.')
      }
    }
    
    const addStoreMarker = (store) => {
      let iconUrl
      
      if (store.type === 'main') {
        iconUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1IDBDNi43MTU3MyAwIDAgNi43MTU3MyAwIDE1QzAgMjMuMjg0MyA2LjcxNTczIDMwIDE1IDMwQzIzLjI4NDMgMzAgMzAgMjMuMjg0MyAzMCAxNUMzMCA2LjcxNTczIDIzLjI4NDMgMCAxNSAwWiIgZmlsbD0iIzdFNUEzQyIvPgo8cGF0aCBkPSJNMTUgN0MxMC41ODIzIDcgNyAxMC41ODIzIDcgMTVDNyAxOS40MTc3IDEwLjU4MjMgMjMgMTUgMjNDMTkuNDE3NyAyMyAyMyAxOS40MTc3IDIzIDE1QzIzIDEwLjU4MjMgMTkuNDE3NyA3IDE1IDdaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
      } else if (store.type === 'coming-soon') {
        iconUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1IDBDNi43MTU3MyAwIDAgNi43MTU3MyAwIDE1QzAgMjMuMjg0MyA2LjcxNTczIDMwIDE1IDMwQzIzLjI4NDMgMzAgMzAgMjMuMjg0MyAzMCAxNUMzMCA2LjcxNTczIDIzLjI4NDMgMCAxNSAwWiIgZmlsbD0iIzlGODU2NSIvPgo8cGF0aCBkPSJNMTUgN0MxMC41ODIzIDcgNyAxMC41ODIzIDcgMTVDNyAxOS40MTc3IDEwLjU4IzMgMjMgMTUgMjNDMTkuNDE3NyAyMyAyMyAxOS40MTc3IDIzIDE1QzIzIDEwLjU4MjMgMTkuNDE3NyA3IDE1IDdaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
      } else {
        iconUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNy41ODIgMiA0IDUuNTgyIDQgMTBDNCAxNiA5IDIyIDEyIDIyQzE1IDIyIDIwIDE2IDIwIDEwQzIwIDUuNTgyIDE2LjQxOCAyIDEyIDJaIiBmaWxsPSIjN0U1QTNDIi8+CjxwYXRoIGQ9Ik0xMiAxM0MxMy4xMDQ2IDEzIDE0IDEyLjEwNDYgMTQgMTFDMTQgOS44OTU0MyAxMy4xMDQ2IDkgMTIgOUMxMC44OTU0IDkgMTAgOS44OTU0MyAxMCAxMUMxMCAxMi4xMDQ2IDEwLjg5NTQgMTMgMTIgMTNaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
      }

      const icon = {
        url: iconUrl,
        scaledSize: new google.maps.Size(30, 30),
        anchor: new google.maps.Point(15, 15)
      }

      const marker = new google.maps.Marker({
        position: store.position,
        map: map.value,
        title: store.name,
        icon: icon
      })

      const infowindow = new google.maps.InfoWindow({
        content: `<div class="map-info-window">
            <h4>${store.name}</h4>
            <p>${store.address}</p>
            <p>${store.phone}</p>
        </div>`
      })

      marker.addListener('click', () => {
        infowindow.open(map.value, marker)
        showStore(getStoreIdByName(store.name))
      })

      markers.value.push(marker)
      return marker
    }

    const getStoreIdByName = (storeName) => {
      for (const [id, store] of Object.entries(stores.value)) {
        if (store.name === storeName) return id
      }
      return null
    }

    const centerMap = () => {
      if (!map.value) {
        showNotification('Map not available')
        return
      }

      if (stores.value[currentStore.value].position) {
        map.value.setCenter(stores.value[currentStore.value].position)
        map.value.setZoom(16)
        showNotification('Map centered on current store')
      }
    }

    const getDirections = (storeId = null) => {
      const targetStore = storeId || currentStore.value
      const address = stores.value[targetStore].address
      if (address) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
        window.open(url, '_blank')
      }
    }

    const callStore = (phoneNumber) => {
      if (phoneNumber !== '—') {
        window.location.href = `tel:${phoneNumber}`
      } else {
        showNotification('Phone number not available for this branch')
      }
    }

    const shareStore = (storeId = null) => {
      const targetStore = storeId || currentStore.value
      const store = stores.value[targetStore]
      const storeInfo = {
        title: store.name,
        text: `Visit ${store.name} at ${store.address}. Great coffee and atmosphere!`,
        url: window.location.href
      }
      
      if (navigator.share) {
        navigator.share(storeInfo)
          .then(() => showNotification('Store shared successfully!'))
          .catch(error => console.log('Error sharing:', error))
      } else {
        navigator.clipboard.writeText(storeInfo.text + ' ' + storeInfo.url)
        showNotification('Store information copied to clipboard!')
      }
    }

    const showNotification = (message) => {
      // Remove existing notifications
      const existingNotifications = document.querySelectorAll('.notification')
      existingNotifications.forEach(notification => {
        document.body.removeChild(notification)
      })

      const notification = document.createElement('div')
      notification.className = 'notification'
      notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
      `
      
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.classList.add('show')
      }, 100)
      
      setTimeout(() => {
        notification.classList.remove('show')
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification)
          }
        }, 300)
      }, 3000)
    }

    // Lifecycle
    onMounted(() => {
      nextTick(() => {
        setTimeout(() => {
          if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
            initMap()
          } else {
            console.error('Google Maps API not loaded')
            showNotification('Maps service loading...')
            setTimeout(() => initMap(), 2000)
          }
        }, 500)
      })

      // Close modal when pressing Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isModalActive.value) {
          closeModal()
        }
      })
    })

    // Return all reactive data and methods
    return {
      currentStore,
      activeCategory,
      map,
      markers,
      modalImageSrc,
      modalImageAlt,
      modalImageCaption,
      isModalActive,
      stores,
      openModal,
      closeModal,
      openStoreImage,
      openOtherStoreImage,
      setActiveCategory,
      showStore,
      showComingSoon,
      initMap,
      addStoreMarker,
      getStoreIdByName,
      centerMap,
      getDirections,
      callStore,
      shareStore,
      showNotification
    }
  }
}
</script>

<style scoped>
/* Color Variables */
:root {
  --dark-brown: #5D4037;
  --brown: #795548;
  --light-brown: #A1887F;
  --beige: #F5F5DC;
  --light-beige: #FFF8E1;
  --gold: #D4AF37;
  --text-light: #FFF8E1;
  --text-dark: #3E2723;
}

/* Dark Mode Variables */
@media (prefers-color-scheme: dark) {
  :root {
    --dark-brown: #3E2723;
    --brown: #5D4037;
    --light-brown: #8D6E63;
    --beige: #2A2118;
    --light-beige: #3A2E22;
    --text-light: #FFF8E1;
    --text-dark: #F5F5DC;
  }
}

/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: var(--text-dark);
  background-color: var(--beige);
}

.compact-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--beige);
  flex-direction: column;
}

/* Sidebar Styles - Dark Brown with Light Beige Text */
.compact-sidebar {
  width: 250px;
  background: linear-gradient(135deg, var(--dark-brown), var(--brown));
  color: var(--text-light);
  padding: 1.5rem 1rem;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  top: 0;
  left: 0;
  z-index: 999;
  margin-top: 60px;
}

.compact-sidebar h2 {
  color: var(--text-light);
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  border-bottom: 2px solid var(--gold);
  padding-bottom: 0.5rem;
}

.nav-links {
  list-style: none;
  margin-bottom: 1.5rem;
}

.nav-links li {
  margin-bottom: 0.4rem;
}

.nav-links a {
  display: flex;
  align-items: center;
  padding: 0.6rem 0.8rem;
  color: var(--text-light);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.9rem;
}

.nav-links a:hover,
.nav-links a.active {
  background: rgba(212, 175, 55, 0.2);
  color: var(--gold);
  transform: translateX(3px);
}

.nav-links i {
  margin-right: 0.6rem;
  width: 16px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--gold);
}

.sub-menu {
  list-style: none;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin-left: 1rem;
}

.sub-menu.active {
  max-height: 300px;
}

.sub-menu li {
  margin-bottom: 0.2rem;
}

.sub-menu a {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  background: transparent;
  color: var(--text-light);
  opacity: 0.8;
}

.sub-menu a:hover {
  background: rgba(212, 175, 55, 0.1);
  color: var(--gold);
  opacity: 1;
}

/* Store Widget */
.store-widget {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1 rem;
  margin-top: 1 rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.store-widget h3 {
  color: var(--gold);
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
}

.store-hours {
  margin-bottom: 1.2rem;
}

.hour-item {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.85rem;
  color: var(--text-light);
}

.hour-item:last-child {
  border-bottom: none;
}

.store-contact p {
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
  font-size: 0.85rem;
  color: var(--text-light);
}

.store-contact i {
  margin-right: 0.4rem;
  color: var(--gold);
  width: 14px;
  font-size: 0.9rem;
}

/* Title Image Section */
.title-image-section {
  position: relative;
  width: calc(100% - 250px);
  margin-left: 250px;
  height: 180px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--dark-brown), var(--brown));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0px;
}

.title-text {
  color: var(--text-light);
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  padding: 0 1rem;
}

/* Main Content */
.compact-main {
  margin-left: 250px;
  padding: 1.5rem;
  width: calc(100% - 250px);
  background-color: var(--light-beige);
  min-height: calc(100vh - 180px - 60px);
  
}

.main-content-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 1.5rem;
}

/* Store Cards - More Compact */
.store-details-compact {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.store-card-compact {
  background: var(--beige);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(126, 90, 60, 0.1);
  transition: all 0.3s ease;
  border: 1px solid var(--light-brown);
  display: none;
   background: linear-gradient(135deg, var(--beige), #d39749);
    border: 2px solid rgba(163, 122, 47, 0.897);
}

.store-card-compact.active {
  display: block;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.store-header-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.store-name-compact {
  color: var(--text-dark);
  font-size: 1rem;
  margin-right: auto;
  font-weight: 600;
}

.store-badge-compact {
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  background: var(--brown);
  color: white;
}

.store-badge-compact.main {
  background: var(--dark-brown);
}

.store-image-compact {
  width: 100%;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.8rem;
  cursor: pointer;
  transition: transform 0.3s ease;
  border: 2px solid var(--light-brown);
}

.store-image-compact:hover {
  transform: scale(1.02);
}

.store-image-compact img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.store-info-compact {
  margin-bottom: 1rem;
}

.info-item-compact {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.6rem;
  padding: 0.5rem;
  background: var(--light-beige);
  border-radius: 6px;
  border-left: 3px solid var(--gold);
  font-size: 0.85rem;
  color: var(--text-dark);
}

.info-item-compact i {
  color: var(--brown);
  margin-right: 0.6rem;
  margin-top: 0.1rem;
  min-width: 14px;
  font-size: 0.85rem;
}

.amenities-compact {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.3rem;
}

.amenity-tag-compact {
  background: var(--brown);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
}

.store-actions-compact {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn-compact {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.8rem;
  border: 2px solid var(--brown);
  background: transparent;
  color: var(--brown);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.8rem;
  flex: 1;
  justify-content: center;
  min-width: 80px;
}

.action-btn-compact.primary {
  background: var(--brown);
  color: white;
}

.action-btn-compact:hover:not(:disabled) {
  background: var(--dark-brown);
  color: white;
  transform: translateY(-1px);
  border-color: var(--dark-brown);
}

.action-btn-compact:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--light-brown);
  border-color: var(--light-brown);
}

/* Map Section */
.map-section-compact {
  background: var(--beige);
  border-radius: 8px;
  padding: 1.2rem;
  box-shadow: 0 2px 4px rgba(126, 90, 60, 0.1);
  height: fit-content;
  position: sticky;
  top: 1.5rem;
   border: 2px solid rgba(163, 122, 47, 0.897);
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.map-header h3 {
  color: var(--text-dark);
  margin: 0;
  font-size: 1.1rem;
}

.map-controls-compact {
  display: flex;
  gap: 0.4rem;
}

.map-control-btn-compact {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  background: var(--brown);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 0.8rem;
}

.map-control-btn-compact:hover {
  background: var(--dark-brown);
}

#storeMap {
  width: 100%;
  height: 350px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid var(--light-brown);
}

/* Other Stores Section */
.other-stores-section {
  margin-top: 3rem;
  padding: 2rem;
  background: var(--beige);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(126, 90, 60, 0.1);
  border: 2px solid var(--light-brown);
}

.other-title-image {
  position: relative;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, var(--dark-brown), var(--brown));
}

.other-title-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
}

.overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--gold);
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.other-stores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.other-store-card {
  background: var(--light-beige);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
  border: 2px solid transparent;
   border: 2px solid rgba(163, 122, 47, 0.897);
}

.other-store-card:hover {
  transform: translateY(-5px);
  border-color: var(--gold);
}

.other-store-card.coming-soon {
  opacity: 0.8;
}

.other-store-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
  cursor: pointer;
}

.other-store-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.other-store-image:hover img {
  transform: scale(1.05);
}

.other-store-info {
  padding: 1.5rem;
  color: var(--text-dark);
}

.other-store-info h4 {
  color: var(--text-dark);
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.coming-soon-badge {
  background: var(--light-brown);
  color: white;
  padding: 0.2rem 0.8rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
}

.other-store-info p {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-dark);
}

.other-store-info i {
  margin-right: 0.5rem;
  color: var(--brown);
  width: 16px;
}

/* Modal Styles */
.image-modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-modal.active {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
}

.modal-content {
  max-width: 90%;
  max-height: 80%;
  object-fit: contain;
  border-radius: 8px;
  border: 3px solid var(--gold);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.close-modal {
  position: absolute;
  top: 20px;
  right: 30px;
  color: var(--text-light);
  font-size: 35px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  z-index: 1001;
}

.close-modal:hover {
  color: var(--gold);
  transform: scale(1.1);
}

.modal-caption {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  text-align: center;
  font-size: 1rem;
  background: rgba(0, 0, 0, 0.8);
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  border: 1px solid var(--gold);
}

/* Notification Styles */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--brown);
  color: white;
  padding: 0.8rem 1.2rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transform: translateX(400px);
  transition: transform 0.3s ease;
  border-left: 4px solid var(--gold);
  font-size: 0.9rem;
}

.notification.show {
  transform: translateX(0);
}

.notification i {
  font-size: 1rem;
  color: var(--gold);
}

/* Map Info Window Styles */
.map-info-window {
  padding: 0.4rem;
  color: var(--text-dark);
}

.map-info-window h4 {
  color: var(--dark-brown);
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
}

.map-info-window p {
  margin: 0.2rem 0;
  color: var(--brown);
  font-size: 0.8rem;
}

/* Scrollbar Styling */
.compact-sidebar::-webkit-scrollbar {
  width: 4px;
}

.compact-sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.compact-sidebar::-webkit-scrollbar-thumb {
  background: var(--gold);
  border-radius: 2px;
}

.compact-sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--brown);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-content-grid {
    grid-template-columns: 1fr;
  }
  
  .map-section-compact {
    position: static;
  }
  
  .compact-sidebar {
    width: 220px;
  }
  
  .title-image-section,
  .compact-main {
    margin-left: 220px;
    width: calc(100% - 220px);
  }
}

@media (max-width: 768px) {
  .compact-container {
    flex-direction: column;
  }
  
  .compact-sidebar {
    position: static;
    width: 100%;
    height: auto;
    margin-top: 0;
  }
  
  .title-image-section,
  .compact-main {
    margin-left: 0;
    width: 100%;
  }
  
  .title-image-section {
    height: 120px;
    margin-top: 0;
  }
  
  .title-text {
    font-size: 1.5rem;
  }
  
  .store-actions-compact {
    justify-content: center;
  }
  
  .other-stores-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .compact-main {
    padding: 1rem;
  }
  
  .title-text {
    font-size: 1.2rem;
  }
  
  .store-header-compact {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }
  
  .store-actions-compact {
    flex-direction: column;
  }
  
  .action-btn-compact {
    width: 100%;
  }
  
  .other-title-image {
    height: 120px;
  }
  
  .overlay-text {
    font-size: 1.5rem;
  }
}

/* Dark mode specific improvements */
@media (prefers-color-scheme: dark) {
  .store-card-compact,
  .map-section-compact,
  .other-stores-section {
    background: var(--light-beige);
    color: var(--text-dark);
  }
  
  .store-name-compact,
  .map-header h3,
  .other-store-info h4 {
    color: var(--text-dark);
  }
  
  .info-item-compact {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-dark);
  }
  
  .other-store-card {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .other-store-info p {
    color: var(--text-dark);
  }
  
  .overlay-text {
    color: var(--gold);
  }
}

/* Light mode specific fixes */
@media (prefers-color-scheme: light) {
  .overlay-text {
    color: var(--gold);
  }
  
  .amenity-tag-compact {
    background: var(--brown);
    color: white;
  }
  
  .map-control-btn-compact {
    background: var(--brown);
    color: white;
  }
  
  .map-header h3 {
    color: var(--text-dark);
  }
}
/* Change ONLY the two main title colors */
.title-image-section .overlay-text {
  color: #cf8907;
  font-size: 2.5rem;
  font-weight: 500;
  text-shadow: 2px 2px 4px rgba(247, 216, 160, 0.8);
}

.other-title-image .overlay-text {
  color: #cf8907; /* Dark brown for "Our Branches Around You" */
  font-size: 2.3rem; /* Slightly smaller but still large */
  font-weight: 600;
  text-shadow: #5c3e1e;
}

/* Responsive adjustments for these two titles only */
@media (max-width: 768px) {
  .title-image-section .overlay-text {
    font-size: 2.2rem;
  }
  
  .other-title-image .overlay-text {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .title-image-section .overlay-text {
    font-size: 1.8rem;
  }
  
  .other-title-image .overlay-text {
    font-size: 1.5rem;
  }
}
/* Option 2 - Coffee Brown Theme */
.amenity-tag-compact {
  background: #8B4513 !important; /* Saddle brown */
  color: #F5F5DC !important; /* Beige text */
}

.map-control-btn-compact {
  background: #A0522D !important; /* Sienna */
  color: white !important;
}

/* Option 3 - Green Theme */
.amenity-tag-compact {
  background: #2E8B57 !important; /* Sea green */
  color: white !important;
}

.map-control-btn-compact {
  background: #228B22 !important; /* Forest green */
  color: white !important;
}
/* Main Branch Badge */
.store-badge-compact.main {
  background: #dea02c  !important; /* Brown background */
  color: #ffffff !important; /* White text */
  border: 2px solid #a76e05 !important; /* Gold border */
}

/* Call Button */
.action-btn-compact.primary {
  background: #dea02c !important; /* Gold background */
  color: #5c3e1e !important; /* Dark brown text */
  border: 2px solid #dea02c !important;
  font-weight: 700;
}

.action-btn-compact.primary:hover {
  background: #5c3e1e !important; /* Dark brown on hover */
  color: #dea02c !important; /* Gold text on hover */
  border-color: #5c3e1e !important;
}
/* Directions Button */
.action-btn-compact:nth-child(2) {
  background: #7e5a3c !important; /* Brown background */
  color: white !important; /* White text */
  border: 2px solid #7e5a3c !important;
  font-weight: 600;
}

.action-btn-compact:nth-child(2):hover {
  background: #5c3e1e !important; /* Dark brown on hover */
  color: #dea02c !important; /* Gold text on hover */
  border-color: #5c3e1e !important;
}

/* Share Button */
.action-btn-compact:nth-child(3) {
  background: #dea02c !important; /* Gold background */
  color: #5c3e1e !important; /* Dark brown text */
  border: 2px solid #dea02c !important;
  font-weight: 600;
}

.action-btn-compact:nth-child(3):hover {
  background: #5c3e1e !important; /* Dark brown on hover */
  color: #dea02c !important; /* Gold text on hover */
  border-color: #5c3e1e !important;
}
</style>