import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-[#fff] text-gray-800 mt-12">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
                    <div>
                        <h3 className="text-black font-bold mb-4">YourDevClone</h3>
                        <p className="text-sm text-gray-800">A constructive and inclusive social network for software developers.With you every step of your journey.</p>
                    </div>
                    <div>
                        <h4 className="text-black font-semibold mb-3">Platform</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-black">Home</Link></li>
                            <li><Link to="/readinglist" className="hover:text-black">Reading List</Link></li>
                            <li><Link to="/dashboard" className="hover:text-black">Dashboard</Link></li>
                            <li><Link to="/tags" className="hover:text-black">Tags</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-black font-semibold mb-3">Community</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-black">Code of Conduct</a></li>
                            <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-black">Terms of use</a></li>
                            <li><a href="#" className="hover:text-black">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-black font-semibold mb-3">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-black">FAQ</a></li>
                            <li><a href="#" className="hover:text-black">Write a Post</a></li>
                            <li><a href="#" className="hover:text-black">Report Abuse</a></li>
                        </ul>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <h4 className="text-black font-semibold mb-3">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-black">Twitter</a>
                            <a href="#" className="hover:text-black">GitHub</a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-800">
                    <p>
                        <span className="font-bold text-black">YourDevClone</span> Community © {currentYear}
                    </p>
                    <p className="mt-2">Built with <span className="text-red-500">♥</span> using MERN Stack. Made by you. Inspired by <a href="https://dev.to" className="text-black hover:underline">DEV.to</a></p>
                </div>
            </div>
        </footer>
    )
}