'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Calendar, Users, Building2, ChevronRight, MapPin, Clock, ArrowRight, Search, Filter, Star, TrendingUp, Award, Heart, Globe, Shield, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'

// Define TypeScript interfaces
interface Event {
  id: string;
  title: string;
  org?: {
    name: string;
    verified: boolean;
  };
  sdgGoal?: string;
  startAt: string;
  endAt: string;
  location?: string;
  capacity: number;
  registrations?: any[];
  description?: string;
}

interface TransformedEvent {
  id: string;
  title: string;
  org: string;
  orgVerified: boolean;
  sdg: string;
  sdgFull: string;
  date: string;
  time: string;
  startAt: string;
  location: string;
  spots: number;
  capacity: number;
  rating: number;
  reviews: number;
  image: string;
  tags: string[];
  description?: string;
  originalData: Event;
}

interface StatItem {
  value: string;
  label: string;
  icon: any;
  color: string;
}

interface SdgGoal {
  num: number;
  title: string;
  color: string;
}

export default function TechLinkApp() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedSDG, setSelectedSDG] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // REAL DATA STATES
  const [realEvents, setRealEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // FETCH REAL EVENTS FROM BACKEND
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const eventsData = await api.getEvents()
        console.log('Fetched events:', eventsData)
        setRealEvents(eventsData)
      } catch (err) {
        console.error('Failed to fetch events:', err)
        setError('Failed to load events from server')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // TRANSFORM REAL EVENTS DATA TO MATCH UI STRUCTURE
  const transformEventData = (event: Event): TransformedEvent => {
    return {
      id: event.id,
      title: event.title,
      org: event.org?.name || 'Unknown Organization',
      orgVerified: event.org?.verified || false,
      sdg: event.sdgGoal?.replace('SDG', '').split(' - ')[0] || '14',
      sdgFull: event.sdgGoal || 'SDG14 - Life Below Water',
      date: new Date(event.startAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: `${new Date(event.startAt).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      })} - ${new Date(event.endAt).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      })}`,
      startAt: event.startAt,
      location: event.location || 'Location TBD',
      spots: event.registrations?.length || 0,
      capacity: event.capacity || 50,
      rating: 4.8,
      reviews: event.registrations?.length || 12,
      image: getEventEmoji(event.sdgGoal),
      tags: [event.sdgGoal?.split(' - ')[1] || 'Environment', 'Community', 'Volunteer'],
      description: event.description,
      originalData: event
    }
  }

  // Helper function to get emoji based on SDG goal
  const getEventEmoji = (sdgGoal?: string): string => {
    const sdgMap: { [key: string]: string } = {
      'SDG14': '🌊',
      'SDG2': '🍎',
      'SDG7': '☀️',
      'SDG4': '📚',
      'SDG5': '👩‍💻',
      'SDG15': '🌳',
      'SDG1': '💰',
      'SDG3': '🏥',
      'SDG6': '💧',
      'SDG8': '📈',
      'SDG9': '🏭',
      'SDG10': '⚖️',
      'SDG11': '🏙️',
      'SDG12': '♻️',
      'SDG13': '��',
      'SDG16': '⚖️',
      'SDG17': '🤝'
    }
    const sdgKey = sdgGoal?.split(' - ')[0] || ''
    return sdgMap[sdgKey] || '🌟'
  }

  // Use real events data
  const featuredEvents = realEvents.slice(0, 3).map(transformEventData)
  const allEvents = realEvents.map(transformEventData)

  // Filter events based on search and SDG selection
  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSDG = selectedSDG === 'all' || event.sdg === selectedSDG
    
    return matchesSearch && matchesSDG
  })

  // Sort events by date (soonest first)
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  )

  useEffect(() => {
    if (featuredEvents.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredEvents.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [featuredEvents.length])

  const sdgGoals: SdgGoal[] = [
    { num: 1, title: "No Poverty", color: "bg-red-600" },
    { num: 2, title: "Zero Hunger", color: "bg-yellow-600" },
    { num: 3, title: "Good Health", color: "bg-green-600" },
    { num: 4, title: "Quality Education", color: "bg-red-700" },
    { num: 5, title: "Gender Equality", color: "bg-orange-600" },
    { num: 6, title: "Clean Water", color: "bg-cyan-500" },
    { num: 7, title: "Clean Energy", color: "bg-yellow-500" },
    { num: 8, title: "Economic Growth", color: "bg-red-800" },
    { num: 9, title: "Innovation", color: "bg-orange-700" },
    { num: 10, title: "Reduced Inequalities", color: "bg-pink-600" },
    { num: 11, title: "Sustainable Cities", color: "bg-yellow-700" },
    { num: 12, title: "Responsible Consumption", color: "bg-yellow-600" },
    { num: 13, title: "Climate Action", color: "bg-green-700" },
    { num: 14, title: "Life Below Water", color: "bg-blue-600" },
    { num: 15, title: "Life on Land", color: "bg-green-500" },
    { num: 16, title: "Peace & Justice", color: "bg-blue-800" },
    { num: 17, title: "Partnerships", color: "bg-blue-900" }
  ]

  const stats: StatItem[] = [
    { value: `${realEvents.length}+`, label: "Active Events", icon: Calendar, color: "from-emerald-500 to-teal-500" },
    { value: "10K+", label: "Volunteers", icon: Users, color: "from-blue-500 to-cyan-500" },
    { value: "200+", label: "Organizations", icon: Building2, color: "from-purple-500 to-pink-500" },
    { value: "25K+", label: "Hours Contributed", icon: Clock, color: "from-orange-500 to-red-500" }
  ]

  const Navigation = () => (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('landing')}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Globe size={24} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              TechLink
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => setCurrentPage('events')} className="text-slate-700 hover:text-emerald-600 font-medium transition-colors">
              Browse Events
            </button>
            <button onClick={() => setCurrentPage('organizations')} className="text-slate-700 hover:text-emerald-600 font-medium transition-colors">
              Organizations
            </button>
            <button onClick={() => setCurrentPage('about')} className="text-slate-700 hover:text-emerald-600 font-medium transition-colors">
              About
            </button>
            <button onClick={() => setCurrentPage('dashboard')} className="text-slate-700 hover:text-emerald-600 font-medium transition-colors">
              Dashboard
            </button>
            <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
              Join Now
            </button>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <button onClick={() => { setCurrentPage('events'); setIsMenuOpen(false); }} className="block w-full text-left text-slate-700 hover:text-emerald-600 font-medium py-2">
              Browse Events
            </button>
            <button onClick={() => { setCurrentPage('organizations'); setIsMenuOpen(false); }} className="block w-full text-left text-slate-700 hover:text-emerald-600 font-medium py-2">
              Organizations
            </button>
            <button onClick={() => { setCurrentPage('dashboard'); setIsMenuOpen(false); }} className="block w-full text-left text-slate-700 hover:text-emerald-600 font-medium py-2">
              Dashboard
            </button>
            <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-lg font-semibold">
              Join Now
            </button>
          </div>
        </div>
      )}
    </nav>
  )

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  )

  const LandingPage = () => (
    <>
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <TrendingUp className="text-emerald-600" size={20} />
              <span className="text-sm font-semibold text-slate-700">Join 10,000+ volunteers making a difference</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
              Connect for
              <span className="block bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Change
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Join SDG events that matter. Make an impact in your community while building a better world through sustainable action.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button 
                onClick={() => setCurrentPage('events')}
                className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center space-x-2"
              >
                <span>Browse Events</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-emerald-500 text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-all duration-300 flex items-center space-x-2">
                <Heart size={20} />
                <span>Join Our Community</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl shadow-md`}>
                      <Icon size={24} className="text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
              FEATURED OPPORTUNITIES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Upcoming Impact Events</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Join these high-impact events and contribute to sustainable development goals</p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600"
              >
                Retry
              </button>
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              <p>No events available at the moment.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="overflow-hidden rounded-3xl shadow-2xl">
                <div className="flex transition-transform duration-700 ease-in-out" 
                     style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                  {featuredEvents.map((event) => (
                    <div key={event.id} className="w-full flex-shrink-0">
                      <div className="bg-white">
                        <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                          <div className="flex items-center justify-center text-9xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-8">
                            {event.image}
                          </div>
                          <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                              <div className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                                SDG {event.sdg}
                              </div>
                              <div className="flex items-center space-x-1 text-amber-500">
                                <Star size={18} fill="currentColor" />
                                <span className="font-semibold text-slate-900">{event.rating}</span>
                                <span className="text-slate-500 text-sm">({event.reviews})</span>
                              </div>
                            </div>
                            
                            <h3 className="text-4xl font-bold text-slate-900">{event.title}</h3>
                            
                            <div className="flex items-center space-x-2 text-slate-700">
                              <Building2 size={20} className="text-emerald-600" />
                              <span className="font-medium">{event.org}</span>
                              {event.orgVerified && <CheckCircle size={18} className="text-blue-500" fill="currentColor" />}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center space-x-2 text-slate-600">
                                <Calendar size={18} className="text-emerald-600" />
                                <span className="text-sm font-medium">{event.date}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-slate-600">
                                <Clock size={18} className="text-emerald-600" />
                                <span className="text-sm font-medium">{event.time}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-slate-600 col-span-2">
                                <MapPin size={18} className="text-emerald-600" />
                                <span className="text-sm font-medium">{event.location}</span>
                              </div>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-slate-600">Registration Progress</span>
                                <span className="text-sm font-bold text-slate-900">{event.spots}/{event.capacity}</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${(event.spots / event.capacity) * 100}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {event.tags.map((tag, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <button 
                              onClick={() => setCurrentPage('event-detail')}
                              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                            >
                              <span>Register Now</span>
                              <ArrowRight size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center space-x-3 mt-8">
                {featuredEvents.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      currentSlide === index 
                        ? 'bg-emerald-500 w-12 h-3' 
                        : 'bg-slate-300 w-3 h-3 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-4">
              GLOBAL IMPACT
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Supporting UN Sustainable Development Goals
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Events aligned with all 17 United Nations Sustainable Development Goals for 2030
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
            {sdgGoals.map((goal) => (
              <div
                key={goal.num}
                className={`${goal.color} rounded-2xl p-6 hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                <div className="relative text-center space-y-2">
                  <div className="text-5xl font-bold">{goal.num}</div>
                  <div className="text-xs font-semibold leading-tight">{goal.title}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button 
              onClick={() => setCurrentPage('events')}
              className="bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-100 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Explore All SDG Events
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <Award size={64} className="mx-auto mb-6 opacity-90" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
              <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto">
                Join thousands of volunteers and organizations working towards a sustainable future. Your impact starts today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all duration-300 hover:scale-105 shadow-xl">
                  Sign Up as Volunteer
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                  Register Organization
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )

  const EventsListingPage = () => {
    return (
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Discover Events</h1>
            <p className="text-xl text-slate-600">Find opportunities to make an impact in your community</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search events by title, organization, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>
              <select 
                value={selectedSDG}
                onChange={(e) => setSelectedSDG(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white"
              >
                <option value="all">All SDG Goals</option>
                {sdgGoals.map(sdg => (
                  <option key={sdg.num} value={sdg.num.toString()}>SDG {sdg.num}: {sdg.title}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600"
              >
                Retry
              </button>
            </div>
          ) : sortedEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No events found</h3>
              <p className="text-slate-600 mb-6">Try adjusting your search criteria or SDG filter</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedSDG('all'); }}
                className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-slate-600">
                  Showing <span className="font-semibold text-slate-900">{sortedEvents.length}</span> event{sortedEvents.length !== 1 ? 's' : ''}
                  {searchQuery && ` for "${searchQuery}"`}
                  {selectedSDG !== 'all' && ` in SDG ${selectedSDG}`}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer hover:scale-105"
                    onClick={() => setCurrentPage('event-detail')}
                  >
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-12 text-center text-6xl">
                      {event.image}
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                          SDG {event.sdg}
                        </span>
                        <div className="flex items-center space-x-1 text-amber-500">
                          <Star size={16} fill="currentColor" />
                          <span className="font-semibold text-slate-900 text-sm">{event.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {event.title}
                      </h3>

                      <div className="flex items-center space-x-2 text-slate-600 text-sm">
                        <Building2 size={16} className="text-emerald-600" />
                        <span className="truncate">{event.org}</span>
                        {event.orgVerified && <CheckCircle size={14} className="text-blue-500 flex-shrink-0" fill="currentColor" />}
                      </div>

                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} className="text-emerald-600" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin size={16} className="text-emerald-600" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span className="text-slate-600">Spots Remaining</span>
                          <span className="font-bold text-slate-900">{event.capacity - event.spots}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full"
                            style={{ width: `${(event.spots / event.capacity) * 100}%` }}
                          />
                        </div>
                      </div>

                      <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  const EventDetailPage = () => (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-12 text-center text-white">
            <div className="text-8xl mb-6">📋</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Event Details</h1>
            <p className="text-xl text-white/90">Complete event information coming soon!</p>
          </div>
          
          <div className="p-8 text-center">
            <p className="text-slate-600 mb-6">This feature will include full event details, registration forms, and more.</p>
            <button 
              onClick={() => setCurrentPage('events')}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const DashboardPage = () => (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Your Dashboard</h1>
          <p className="text-xl text-slate-600">Track your impact and upcoming events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500">
            <Calendar className="text-emerald-500 mb-4" size={32} />
            <div className="text-3xl font-bold text-slate-900 mb-1">12</div>
            <div className="text-slate-600 font-medium">Events Attended</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <Clock className="text-blue-500 mb-4" size={32} />
            <div className="text-3xl font-bold text-slate-900 mb-1">45</div>
            <div className="text-slate-600 font-medium">Volunteer Hours</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <Globe className="text-purple-500 mb-4" size={32} />
            <div className="text-3xl font-bold text-slate-900 mb-1">8</div>
            <div className="text-slate-600 font-medium">SDGs Supported</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500">
            <Star className="text-amber-500 mb-4" size={32} />
            <div className="text-3xl font-bold text-slate-900 mb-1">4.9</div>
            <div className="text-slate-600 font-medium">Average Rating</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <Award className="text-emerald-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Impact Dashboard</h2>
          <p className="text-slate-600 mb-6">Full dashboard features with event history, certificates, and analytics coming soon!</p>
          <button 
            onClick={() => setCurrentPage('landing')}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )

  const OrganizationsPage = () => (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Partner Organizations</h1>
          <p className="text-xl text-slate-600">Discover organizations making a difference worldwide</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-20 h-20 rounded-xl flex items-center justify-center mb-4 text-3xl">
                🏢
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Organization {i}</h3>
              <p className="text-slate-600 text-sm mb-4">Making impact through sustainable development initiatives</p>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <Users size={16} />
                <span>150+ volunteers</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button 
            onClick={() => setCurrentPage('landing')}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )

  const AboutPage = () => (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Globe size={40} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">About TechLink</h1>
            <p className="text-xl text-slate-600">Connecting communities for sustainable impact</p>
          </div>

          <div className="space-y-6 text-slate-700 leading-relaxed">
            <p className="text-lg">
              TechLink is a platform dedicated to connecting volunteers with meaningful opportunities to contribute to the United Nations Sustainable Development Goals (SDGs).
            </p>
            <p className="text-lg">
              We believe that every individual has the power to make a difference, and by bringing together passionate volunteers and impactful organizations, we're building a more sustainable future for all.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="text-center p-6 bg-emerald-50 rounded-2xl">
                <div className="text-4xl font-bold text-emerald-600 mb-2">10K+</div>
                <div className="text-slate-700 font-medium">Active Volunteers</div>
              </div>
              <div className="text-center p-6 bg-teal-50 rounded-2xl">
                <div className="text-4xl font-bold text-teal-600 mb-2">200+</div>
                <div className="text-slate-700 font-medium">Partner Organizations</div>
              </div>
              <div className="text-center p-6 bg-cyan-50 rounded-2xl">
                <div className="text-4xl font-bold text-cyan-600 mb-2">17</div>
                <div className="text-slate-700 font-medium">SDGs Supported</div>
              </div>
            </div>

            <div className="text-center pt-6">
              <button 
                onClick={() => setCurrentPage('landing')}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const Footer = () => (
    <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Globe size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold">TechLink</span>
            </div>
            <p className="text-slate-400">Connecting people for sustainable change</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => setCurrentPage('events')} className="hover:text-white transition-colors">Browse Events</button></li>
              <li><button onClick={() => setCurrentPage('organizations')} className="hover:text-white transition-colors">Organizations</button></li>
              <li><button onClick={() => setCurrentPage('about')} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => setCurrentPage('dashboard')} className="hover:text-white transition-colors">Dashboard</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
          <p>&copy; 2024 TechLink. All rights reserved. Built with 💚 for a sustainable future.</p>
        </div>
      </div>
    </footer>
  )

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'events' && <EventsListingPage />}
      {currentPage === 'event-detail' && <EventDetailPage />}
      {currentPage === 'dashboard' && <DashboardPage />}
      {currentPage === 'organizations' && <OrganizationsPage />}
      {currentPage === 'about' && <AboutPage />}
      
      <Footer />
    </div>
  )
}
