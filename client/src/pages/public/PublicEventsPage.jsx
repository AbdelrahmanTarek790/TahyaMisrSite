import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Search, Calendar, MapPin, Users, ArrowLeft } from 'lucide-react'

const PublicEventsPage = () => {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0 })

  useEffect(() => {
    fetchEvents()
  }, [pagination.page])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      // For public access, we'll make a request without authentication headers
      const response = await fetch(`http://localhost:5000/api/events?page=${pagination.page}&limit=${pagination.limit}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
        setPagination(prev => ({
          ...prev,
          total: data.total || 0,
        }))
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isEventPast = (dateString) => {
    return new Date(dateString) < new Date()
  }

  const isEventToday = (dateString) => {
    const eventDate = new Date(dateString)
    const today = new Date()
    return eventDate.toDateString() === today.toDateString()
  }

  const getEventStatus = (dateString) => {
    if (isEventToday(dateString)) return { label: 'Today', className: 'bg-green-500' }
    if (isEventPast(dateString)) return { label: 'Past', className: 'bg-gray-500' }
    return { label: 'Upcoming', className: 'bg-blue-500' }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Tahya Misr</h1>
              <span className="ml-2 text-sm text-gray-600">Students Union Platform</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">Events & Activities</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover workshops, conferences, cultural events, and community activities organized by the Tahya Misr Students Union
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Events Grid */}
          {isLoading && events.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'No events found' : 'No events available'}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm
                      ? 'Try adjusting your search terms'
                      : 'Check back later for upcoming events'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const status = getEventStatus(event.date)
                return (
                  <Card key={event._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {event.image && (
                      <div className="aspect-video overflow-hidden relative">
                        <img
                          src={`http://localhost:5000${event.image}`}
                          alt={event.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                        <div className={`absolute top-2 right-2 ${status.className} text-white px-2 py-1 rounded-full text-xs font-semibold`}>
                          {status.label}
                        </div>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                      <CardDescription className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="mr-1 h-3 w-3" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="mr-1 h-3 w-3" />
                          {event.registrations?.length || 0} registered
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-3 mb-4">{event.description}</p>
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {!isEventPast(event.date) ? (
                          <Link to="/register">
                            <Button size="sm">
                              Join to Register
                            </Button>
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-500">Event ended</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.total > pagination.limit && !searchTerm && (
            <div className="flex justify-center space-x-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1 || isLoading}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
              </span>
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit) || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Participate?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community to register for events, participate in activities, and connect with fellow students
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3">
              Join Our Community
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Tahya Misr</h3>
              <p className="text-gray-400">
                Empowering Egyptian students through unity and positive change.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/public/news" className="text-gray-400 hover:text-white">News</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Student Portal</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-400 hover:text-white">Login</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white">Register</Link></li>
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <p className="text-gray-400">
                Cairo, Egypt<br />
                contact@tahyamisr.org<br />
                +20 123 456 7890
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Tahya Misr Students Union. All rights reserved.
            </p>
          </div>
        </div>
      </footer>      
    </div>
  )
}

export default PublicEventsPage