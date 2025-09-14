import Card from "../components/common/Card"

const AboutPage = () => {
  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      bio: "Former city council member passionate about civic engagement and technology.",
      image: "/professional-woman-headshot.png",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Software engineer with 10+ years experience in government technology solutions.",
      image: "/professional-man-headshot.png",
    },
    {
      name: "Emily Rodriguez",
      role: "Community Manager",
      bio: "Community organizer dedicated to bridging the gap between citizens and government.",
      image: "/professional-woman-headshot.png",
    },
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About CivicFlow</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building the future of civic engagement, one community at a time.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              CivicFlow was born from the belief that every citizen deserves a voice in their community. We've created a
              platform that bridges the gap between citizens and local government, making it easier than ever to report
              issues, track progress, and create meaningful change.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our goal is to foster transparency, accountability, and collaboration between communities and their
              elected officials, ultimately leading to stronger, more responsive local governments.
            </p>
          </Card>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparency</h3>
              <p className="text-gray-600">
                We believe in open communication and clear processes that build trust between citizens and government.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Efficiency</h3>
              <p className="text-gray-600">
                Our platform streamlines civic processes, making it faster and easier to address community needs.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Empowerment</h3>
              <p className="text-gray-600">
                We empower citizens to take an active role in shaping their communities and creating positive change.
              </p>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="p-6 text-center">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section>
          <Card className="p-8 bg-blue-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Our Impact</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Since Launch</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 2,847 civic issues resolved</li>
                  <li>• 15,392 active community members</li>
                  <li>• 89% government response rate</li>
                  <li>• 24-hour average response time</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Community Benefits</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Improved infrastructure maintenance</li>
                  <li>• Enhanced public safety measures</li>
                  <li>• Stronger citizen-government relationships</li>
                  <li>• More responsive local services</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default AboutPage
