import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useError } from '../context/ErrorContext'
import { useAuth } from '../context/AuthContext'
import { mediaAPI } from '../api'
import { Search, Download, Eye, Calendar, Image as ImageIcon, Video, FileText, Upload, Plus } from 'lucide-react'
import CreateMediaSheet from '../components/forms/CreateMediaSheet'

const MediaPage = () => {
  const [media, setMedia] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0 })
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false)
  const { addError } = useError()
  const { user } = useAuth()

  useEffect(() => {
    fetchMedia()
  }, [pagination.page])

  const fetchMedia = async () => {
    try {
      setIsLoading(true)
      const response = await mediaAPI.getAll({
        page: pagination.page,
        limit: pagination.limit,
      })
      setMedia(response.data?.media || [])
      setPagination(prev => ({
        ...prev,
        total: response.data?.total || 0,
      }))
    } catch (error) {
      addError('Failed to fetch media')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.originalName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || 
                       (filterType === 'image' && item.type?.startsWith('image/')) ||
                       (filterType === 'video' && item.type?.startsWith('video/')) ||
                       (filterType === 'document' && !item.type?.startsWith('image/') && !item.type?.startsWith('video/'))
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

  const getFileType = (mimeType) => {
    if (mimeType?.startsWith('image/')) return 'image'
    if (mimeType?.startsWith('video/')) return 'video'
    return 'document'
  }

  const getFileIcon = (mimeType) => {
    const type = getFileType(mimeType)
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

  const getTypeColor = (mimeType) => {
    const type = getFileType(mimeType)
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

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleDownload = (mediaItem) => {
    if (mediaItem.url) {
      window.open(`http://localhost:5000${mediaItem.url}`, '_blank')
    } else {
      addError('File not available for download')
    }
  }

  const handlePreview = (mediaItem) => {
    if (mediaItem.url) {
      window.open(`http://localhost:5000${mediaItem.url}`, '_blank')
    } else {
      addError('File not available for preview')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600">Manage and access media files, documents, and resources</p>
        </div>
        {user?.role === 'admin' && (
          <Button onClick={() => setIsCreateSheetOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        )}
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
                    {getFileType(mediaItem.type)}
                  </span>
                </div>
                <CardTitle className="text-sm line-clamp-2">
                  {mediaItem.caption || mediaItem.originalName || 'Untitled'}
                </CardTitle>
                <CardDescription className="text-xs">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(mediaItem.createdAt)}
                  </div>
                  <div className="text-gray-500">
                    {formatFileSize(mediaItem.size)}
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.total > pagination.limit && !searchTerm && (
        <div className="flex justify-center space-x-2">
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

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Images</p>
                <p className="text-2xl font-semibold">
                  {media.filter(m => getFileType(m.type) === 'image').length}
                </p>
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
                <p className="text-2xl font-semibold">
                  {media.filter(m => getFileType(m.type) === 'video').length}
                </p>
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
                <p className="text-2xl font-semibold">
                  {media.filter(m => getFileType(m.type) === 'document').length}
                </p>
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
      
      {/* Create Media Sheet */}
      <CreateMediaSheet
        isOpen={isCreateSheetOpen}
        onClose={() => setIsCreateSheetOpen(false)}
        onSuccess={() => {
          fetchMedia();
          setPagination(prev => ({ ...prev, page: 1 }));
        }}
      />
    </div>
  )
}

export default MediaPage