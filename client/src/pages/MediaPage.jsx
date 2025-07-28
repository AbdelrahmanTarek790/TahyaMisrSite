import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Search, Download, Eye, Calendar, Image as ImageIcon, Video, FileText, Upload } from 'lucide-react'

const MediaPage = () => {
  const [media, setMedia] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0 })

  // Mock data for media files
  useEffect(() => {
    // In a real app, this would fetch from the API
    setMedia([
      {
        _id: '1',
        name: 'Student Union Conference 2024',
        type: 'image',
        url: '/api/media/conference-2024.jpg',
        size: '2.4 MB',
        uploadedAt: '2024-01-15T10:30:00Z',
        uploadedBy: 'Admin',
        category: 'events'
      },
      {
        _id: '2', 
        name: 'Tahya Misr Logo Pack',
        type: 'image',
        url: '/api/media/logo-pack.zip',
        size: '1.2 MB',
        uploadedAt: '2024-01-10T14:20:00Z',
        uploadedBy: 'Design Team',
        category: 'branding'
      },
      {
        _id: '3',
        name: 'Welcome Video 2024',
        type: 'video',
        url: '/api/media/welcome-video.mp4',
        size: '45.6 MB',
        uploadedAt: '2024-01-05T09:15:00Z',
        uploadedBy: 'Media Team',
        category: 'promotional'
      },
      {
        _id: '4',
        name: 'Student Handbook 2024',
        type: 'document',
        url: '/api/media/handbook-2024.pdf',
        size: '3.8 MB',
        uploadedAt: '2024-01-01T12:00:00Z',
        uploadedBy: 'Admin',
        category: 'documents'
      },
      {
        _id: '5',
        name: 'Event Gallery - Cultural Night',
        type: 'image',
        url: '/api/media/cultural-night-gallery.zip',
        size: '15.2 MB',
        uploadedAt: '2023-12-20T16:45:00Z',
        uploadedBy: 'Photography Team',
        category: 'events'
      },
      {
        _id: '6',
        name: 'Annual Report 2023',
        type: 'document',
        url: '/api/media/annual-report-2023.pdf',
        size: '5.1 MB',
        uploadedAt: '2023-12-31T23:59:00Z',
        uploadedBy: 'Admin',
        category: 'reports'
      }
    ])
  }, [])

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || item.type === filterType
    return matchesSearch && matchesType
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-8 w-8 text-blue-600" />
      case 'video':
        return <Video className="h-8 w-8 text-purple-600" />
      case 'document':
        return <FileText className="h-8 w-8 text-green-600" />
      default:
        return <FileText className="h-8 w-8 text-gray-600" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'image':
        return 'bg-blue-100 text-blue-800'
      case 'video':
        return 'bg-purple-100 text-purple-800'
      case 'document':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDownload = (mediaItem) => {
    // In a real app, this would handle file download
    console.log('Downloading:', mediaItem.name)
    alert(`Downloading ${mediaItem.name}...`)
  }

  const handlePreview = (mediaItem) => {
    // In a real app, this would open file preview
    console.log('Previewing:', mediaItem.name)
    alert(`Previewing ${mediaItem.name}...`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600">Manage and access media files, documents, and resources</p>
        </div>
        <Button className="flex items-center">
          <Upload className="h-4 w-4 mr-2" />
          Upload Media
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('all')}
          >
            All
          </Button>
          <Button
            variant={filterType === 'image' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('image')}
          >
            Images
          </Button>
          <Button
            variant={filterType === 'video' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('video')}
          >
            Videos
          </Button>
          <Button
            variant={filterType === 'document' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('document')}
          >
            Documents
          </Button>
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-8 w-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMedia.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No media found' : 'No media files'}
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? 'Try adjusting your search terms or filters'
                  : 'Upload your first media file to get started'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((mediaItem) => (
            <Card key={mediaItem._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  {getFileIcon(mediaItem.type)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(mediaItem.type)}`}>
                    {mediaItem.type}
                  </span>
                </div>
                <CardTitle className="text-sm line-clamp-2">{mediaItem.name}</CardTitle>
                <CardDescription className="text-xs">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(mediaItem.uploadedAt)}
                  </div>
                  <div className="text-gray-500">
                    {mediaItem.size} • {mediaItem.uploadedBy}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePreview(mediaItem)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownload(mediaItem)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {mediaItem.category}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Images</p>
                <p className="text-2xl font-semibold">{media.filter(m => m.type === 'image').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Video className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Videos</p>
                <p className="text-2xl font-semibold">{media.filter(m => m.type === 'video').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-2xl font-semibold">{media.filter(m => m.type === 'document').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Upload className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Total Files</p>
                <p className="text-2xl font-semibold">{media.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MediaPage