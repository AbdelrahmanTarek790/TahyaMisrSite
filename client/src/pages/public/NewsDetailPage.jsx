import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import { newsAPI } from '../../api'

const NewsDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [newsItem, setNewsItem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [relatedNews, setRelatedNews] = useState([])

  useEffect(() => {
    fetchNews()
    fetchRelatedNews()
  }, [id])

  const fetchNews = async () => {
    try {
      setIsLoading(true)
      // For public access, make direct fetch request
      const response = await fetch(`http://localhost:5000/api/news/${id}`)
      if (response.ok) {
        const data = await response.json()
        setNewsItem(data.news || data.data)
      } else {
        setError('News article not found')
      }
    } catch (error) {
      console.error('Failed to fetch news:', error)
      setError('Failed to load news article')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRelatedNews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/news?limit=3`)
      if (response.ok) {
        const data = await response.json()
        setRelatedNews((data.news || data.data || []).filter(item => item._id !== id).slice(0, 3))
      }
    } catch (error) {
      console.error('Failed to fetch related news:', error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content) => {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return readingTime
  }

  const shareOnSocial = (platform) => {
    const url = window.location.href
    const title = newsItem?.title
    
    let shareUrl = ''
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    // You could add a toast notification here
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !newsItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested article could not be found.'}</p>
          <Link to="/public/news">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to News
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Image */}
        {newsItem.image && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img
              src={`http://localhost:5000${newsItem.image}`}
              alt={newsItem.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {newsItem.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {formatDate(newsItem.createdAt)}
              </div>
              
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                By {newsItem.author?.name || 'Admin'}
              </div>
              
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {getReadingTime(newsItem.content)} min read
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 mr-2">Share:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial('facebook')}
                className="text-blue-600 hover:bg-blue-50"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial('twitter')}
                className="text-blue-400 hover:bg-blue-50"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial('linkedin')}
                className="text-blue-700 hover:bg-blue-50"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="text-gray-600 hover:bg-gray-50"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {newsItem.content}
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedNews.length > 0 && (
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((article) => (
                <Card key={article._id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <Link to={`/news/${article._id}`}>
                    {article.image && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={`http://localhost:5000${article.image}`}
                          alt={article.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                        {article.content}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(article.createdAt)}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white mt-12">
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
    </div>
  )
}

export default NewsDetailPage