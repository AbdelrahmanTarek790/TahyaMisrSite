import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Users, Target, Heart, Award, ArrowLeft } from 'lucide-react'

const AboutPage = () => {
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
          <h1 className="text-4xl font-bold mb-6">About Tahya Misr</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            We are a student-led movement dedicated to empowering Egyptian youth, 
            fostering unity among university students, and creating positive change in our communities.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8">
              <Target className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To unite Egyptian students across all universities and governorates, providing a platform 
                for collaboration, leadership development, and meaningful engagement in national affairs. 
                We strive to amplify student voices and create opportunities for positive impact.
              </p>
            </Card>

            <Card className="p-8">
              <Heart className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                A unified Egypt where every student has the opportunity to contribute to their nation's 
                development, where education serves as a catalyst for progress, and where young voices 
                shape the future of our beloved country.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Unity</h3>
              <p className="text-gray-600">
                Bringing together students from diverse backgrounds to work towards common goals
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-gray-600">
                Striving for the highest standards in education, leadership, and service
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Service</h3>
              <p className="text-gray-600">
                Dedicating ourselves to serving our communities and contributing to Egypt's progress
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-lg text-gray-600">
              Our activities and initiatives that make a difference
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-3">Student Representation</h4>
              <p className="text-gray-600">
                Advocating for student rights and interests at university and national levels
              </p>
            </Card>

            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-3">Leadership Development</h4>
              <p className="text-gray-600">
                Organizing workshops and training programs to develop student leadership skills
              </p>
            </Card>

            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-3">Community Service</h4>
              <p className="text-gray-600">
                Coordinating volunteer activities and community outreach programs
              </p>
            </Card>

            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-3">Cultural Events</h4>
              <p className="text-gray-600">
                Hosting cultural activities that celebrate Egyptian heritage and promote unity
              </p>
            </Card>

            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-3">Academic Support</h4>
              <p className="text-gray-600">
                Providing resources and support systems to help students succeed academically
              </p>
            </Card>

            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-3">Networking</h4>
              <p className="text-gray-600">
                Creating connections between students, alumni, and industry professionals
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Be Part of the Movement</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of Egyptian students who are making a difference. Together, we can build a better future for Egypt.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Join Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                Contact Us
              </Button>
            </Link>
          </div>
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
                <li><Link to="/public/news" className="text-gray-400 hover:text-white">News</Link></li>
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

export default AboutPage