"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Button from "../components/common/Button"
import Card from "../components/common/Card"
import { CheckCircle, Users, BarChart3, Shield, MapPin, Clock, Award, ArrowRight } from "lucide-react"

const HomePage = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: "Report Issues",
      description: "Easily report civic issues in your community with photos, location data, and detailed descriptions.",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Community Engagement",
      description: "Vote on issues, add comments, and collaborate with fellow citizens to drive change.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Track Progress",
      description: "Monitor the status of reported issues and see real-time updates from local authorities.",
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Government Transparency",
      description: "Direct communication channel between citizens and local government officials.",
    },
  ]

  const stats = [
    { number: "2,847", label: "Issues Resolved", growth: "+12%" },
    { number: "15,392", label: "Active Citizens", growth: "+24%" },
    { number: "89%", label: "Response Rate", growth: "+5%" },
    { number: "24h", label: "Avg Response Time", growth: "-15%" },
  ]

  const benefits = [
    "Real-time issue tracking",
    "Photo and video uploads", 
    "Community voting system",
    "Government response tracking",
    "Mobile-friendly platform",
    "Data analytics dashboard"
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                🎉 Now serving 50+ cities across India
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Your Voice,<br />
              <span className="text-blue-600">Your Community</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              CivicFlow empowers citizens to report civic issues, engage with their community, and create positive change. 
              Join thousands of Indians building better neighborhoods together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              {user ? (
                <Link to="/dashboard">
                  <button className="group inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                    Go to Dashboard
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <button className="group inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                      Get Started Free
                    </button>
                  </Link>
                  <Link to="/login">
                    <button className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transform hover:scale-105 transition-all duration-200">
                      Sign In
                    </button>
                  </Link>
                </>
              )}
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Trusted by 15K+ citizens</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-500" />
                <span>Digital India Award Winner</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>Government Certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Real Impact, Real Numbers</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              See how CivicFlow is transforming communities across India
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-blue-50 rounded-xl p-6 group-hover:bg-blue-100 transition-colors">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">{stat.number}</div>
                  <div className="text-gray-700 font-medium mb-1 text-sm">{stat.label}</div>
                  <div className="text-xs text-green-600 font-medium">{stat.growth} this month</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">How CivicFlow Works</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Simple, effective tools for civic engagement and community improvement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 bg-white hover:shadow-lg transition-all duration-300 border-0">
                <div className="mb-4 flex justify-center">
                  <div className="bg-blue-50 rounded-full p-3">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Everything you need to create change
              </h2>
              <p className="text-base text-gray-600 mb-6">
                CivicFlow provides all the tools necessary to report, track, and resolve civic issues in your community.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
              {!user && (
                <div className="mt-6">
                  <Link to="/register">
                    <button className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                      Start Making a Difference
                    </button>
                  </Link>
                </div>
              )}
            </div>
            <div className="lg:text-center">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6">
                <div className="text-4xl mb-3">📱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile First Design</h3>
                <p className="text-gray-600 text-sm">
                  Access CivicFlow anywhere, anytime. Our mobile-optimized platform ensures you can report and track issues on the go.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NGO Registration Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                🌟 Special Opportunity for Organizations
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Partner with Us as an NGO
            </h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto mb-8">
              Transform your community impact by becoming a registered NGO partner on CivicFlow. 
              Help amplify citizen voices, coordinate community initiatives, and drive meaningful change.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {[
              {
                icon: <Users className="h-8 w-8 text-green-600" />,
                title: "Community Impact",
                description: "Directly address local issues reported by citizens and create lasting solutions"
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-green-600" />,
                title: "Data-Driven Approach",
                description: "Access analytics and insights to identify the most pressing community needs"
              },
              {
                icon: <Shield className="h-8 w-8 text-green-600" />,
                title: "Verified Status",
                description: "Gain credibility with government verification and transparent reporting"
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="bg-white rounded-full p-4 shadow-md">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg inline-block">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Make a Bigger Impact?</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Join hands with CivicFlow to create systematic change in your community. 
                Apply now to become a verified NGO partner.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <button className="inline-flex items-center justify-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                    Apply as NGO Partner
                  </button>
                </Link>
                <Link to="/contact">
                  <button className="inline-flex items-center justify-center px-8 py-3 border-2 border-green-600 text-green-700 hover:bg-green-50 hover:border-green-700 font-semibold rounded-lg transform hover:scale-105 transition-all duration-200">
                    Learn More
                  </button>
                </Link>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Free application • Government verified • Instant community access
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Issue Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Popular Issue Categories</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              See what issues citizens are reporting most in their communities
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <MapPin className="h-6 w-6 text-purple-600" />,
                title: "Road & Infrastructure",
                count: "1,247 reports",
                description: "Potholes, street lighting, traffic signals, and road maintenance issues"
              },
              {
                icon: <Users className="h-6 w-6 text-green-600" />,
                title: "Public Services",
                count: "892 reports", 
                description: "Water supply, electricity, waste management, and public transport"
              },
              {
                icon: <Shield className="h-6 w-6 text-orange-600" />,
                title: "Safety & Security",
                count: "634 reports",
                description: "Public safety, security concerns, and emergency response issues"
              }
            ].map((category, index) => (
              <Card key={index} className="p-6 bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{category.title}</h3>
                    <p className="text-sm text-blue-600 font-medium mb-2">{category.count}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{category.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/issues">
              <button className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                Browse All Issues
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Get Started in 3 Easy Steps</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Report and track civic issues in your community with just a few clicks
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Sign up with your email and verify your location to get started"
              },
              {
                step: "02", 
                title: "Report Issue",
                description: "Take a photo, add description, and mark the location of the issue"
              },
              {
                step: "03",
                title: "Track Progress",
                description: "Get updates on your report and see when it gets resolved"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-base text-gray-300 mb-8 leading-relaxed">
            Whether you're a citizen wanting to report issues or an NGO looking to create systematic change - 
            join thousands who are building better communities together.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <button className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Join as Citizen
                </button>
              </Link>
              <Link to="/register">
                <button className="inline-flex items-center justify-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Apply as NGO
                </button>
              </Link>
              <Link to="/issues">
                <button className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500 font-semibold rounded-lg transform hover:scale-105 transition-all duration-200">
                  Browse Issues
                </button>
              </Link>
            </div>
          )}
          <div className="mt-6 text-gray-400 text-xs">
            No credit card required • Free to use • Government verified partners
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
