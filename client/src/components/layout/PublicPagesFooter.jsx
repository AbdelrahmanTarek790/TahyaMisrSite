import React from "react"
import { Link } from "react-router-dom"

export default function PublicPagesFooter() {


    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Tahya Misr</h3>
                        <p className="text-gray-400">Empowering Egyptian students through unity and positive change.</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-white">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/public/news" className="text-gray-400 hover:text-white">
                                    News
                                </Link>
                            </li>
                            <li>
                                <Link to="/public/events" className="text-gray-400 hover:text-white">
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-white">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Student Portal</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/login" className="text-gray-400 hover:text-white">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-gray-400 hover:text-white">
                                    Register
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-gray-400 hover:text-white">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
                        <p className="text-gray-400">
                            Cairo, Egypt
                            <br />
                            contact@tahyamisr.org
                            <br />
                            +20 123 456 7890
                        </p>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                    <p className="text-gray-400">© 2024 Tahya Misr Students Union. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
