import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Calendar, Newspaper, Users, MapPin } from "lucide-react"

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}

            {/* Hero Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to Tahya Misr</h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Empowering Egyptian students through unity, leadership, and positive change. Join our platform to connect with fellow
                        students, stay updated on events, and be part of a movement that's shaping Egypt's future.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link to="/register">
                            <Button size="lg" className="px-8 py-3">
                                Join Our Community
                            </Button>
                        </Link>
                        <Link to="/about">
                            <Button variant="outline" size="lg" className="px-8 py-3">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
                        <p className="text-lg text-gray-600">Discover the tools and opportunities available to our student community</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                            <Newspaper className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Latest News</h3>
                            <p className="text-gray-600 mb-4">Stay informed with the latest updates and announcements from the union</p>
                            <Link to="/public/news">
                                <Button variant="outline" size="sm">
                                    View News
                                </Button>
                            </Link>
                        </Card>

                        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                            <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Events</h3>
                            <p className="text-gray-600 mb-4">Join our events, workshops, and activities throughout the year</p>
                            <Link to="/public/events">
                                <Button variant="outline" size="sm">
                                    View Events
                                </Button>
                            </Link>
                        </Card>

                        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                            <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Community</h3>
                            <p className="text-gray-600 mb-4">Connect with students from universities across Egypt</p>
                            <Link to="/register">
                                <Button variant="outline" size="sm">
                                    Join Now
                                </Button>
                            </Link>
                        </Card>

                        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                            <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Nationwide</h3>
                            <p className="text-gray-600 mb-4">Representing students from all governorates of Egypt</p>
                            <Link to="/about">
                                <Button variant="outline" size="sm">
                                    Learn More
                                </Button>
                            </Link>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
                    <p className="text-xl text-blue-100 mb-8">Join thousands of students who are already part of the Tahya Misr community</p>
                    <Link to="/register">
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                            Get Started Today
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default LandingPage
