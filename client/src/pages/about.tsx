import { Navigation } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { Heart, Users, Globe, MessageCircle } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">About Reclist</h1>
          <p className="text-xl text-neutral-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Medias with a story to tell
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="p-8 mb-8 border border-neutral-200 dark:border-gray-700">
          <div className="prose prose-lg max-w-none text-neutral-700 dark:text-gray-300">
            <p className="text-lg leading-relaxed mb-6">
              Reclist is a platform for people from all over the world to connect. We value sharing our favorite stories and why they mean so much to us. Our goal is for people to be authentic and bring exposure to their favorite medias. Reclist also allows for people to have discussions about material they already know, or even just discovered and want to know more. Enjoy!
            </p>
          </div>
        </Card>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center border border-neutral-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-primary mb-2">Global Community</h3>
            <p className="text-sm text-neutral-600 dark:text-gray-400">
              Connect with people from all over the world
            </p>
          </Card>

          <Card className="p-6 text-center border border-neutral-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-primary mb-2">Authentic Stories</h3>
            <p className="text-sm text-neutral-600 dark:text-gray-400">
              Share why your favorite media matters to you
            </p>
          </Card>

          <Card className="p-6 text-center border border-neutral-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-primary mb-2">Media Exposure</h3>
            <p className="text-sm text-neutral-600 dark:text-gray-400">
              Bring exposure to your favorite content
            </p>
          </Card>

          <Card className="p-6 text-center border border-neutral-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-primary mb-2">Rich Discussions</h3>
            <p className="text-sm text-neutral-600 dark:text-gray-400">
              Discover and discuss media with others
            </p>
          </Card>
        </div>

        {/* Vision Section */}
        <Card className="p-8 border border-neutral-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-primary mb-4 text-center">Our Vision</h2>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-neutral-600 dark:text-gray-300 leading-relaxed">
              We believe that the stories behind our favorite media are just as important as the media itself. 
              Every song, book, movie, or piece of art that moves us has a story about why it resonates. 
              Reclist is where those stories come alive and connect us with others who share our passions.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}