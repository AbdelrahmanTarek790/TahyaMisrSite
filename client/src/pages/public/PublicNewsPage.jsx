import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Search, Calendar, ArrowLeft } from 'lucide-react'
import { newsAPI } from '../../api'

const PublicNewsPage = () => {
  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0 })

  useEffect(() => {
    fetchNews()
  }, [pagination.page])

  const fetchNews = async () => {
    try {
      setIsLoading(true)
      // For public access, we'll make a request without authentication headers
      const response = await fetch(`http://localhost:5000/api/news?page=${pagination.page}&limit=${pagination.limit}`)
      if (response.ok) {
        const data = await response.json()
        setNews(data.news || [])
        setPagination(prev => ({
          ...prev,
          total: data.total || 0,
        }))
      }
    } catch (error) {
      console.error('Failed to fetch news:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredNews = news.filter(newsItem =>
    newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    newsItem.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">Latest News & Updates</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Stay informed with the latest announcements, achievements, and news from the Tahya Misr Students Union
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
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* News Grid */}
          {isLoading && news.length === 0 ? (
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
          ) : filteredNews.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'No news found' : 'No news available'}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm
                      ? 'Try adjusting your search terms'
                      : 'Check back later for updates'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((newsItem) => (
                <Card key={newsItem._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {newsItem.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={`http://localhost:5000${newsItem.image}`}
                        alt={newsItem.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{newsItem.title}</CardTitle>
                    <CardDescription className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatDate(newsItem.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3 mb-4">{newsItem.content}</p>
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm">
                        Read More
                      </Button>
                      <span className="text-xs text-gray-500">
                        By {newsItem.author?.name || 'Admin'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Want to Stay Updated?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community to get the latest news and updates delivered directly to your dashboard
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
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
                <li><Link to="/public/events" className="text-gray-400 hover:text-white">Events</Link></li>
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

export default PublicNewsPage