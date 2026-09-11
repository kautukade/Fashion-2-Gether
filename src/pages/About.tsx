import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Truck, Globe, Award } from 'lucide-react';

export default function About() {
  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden mb-16 sm:mb-24">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop"
            alt="About Fashion 2 Gether"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/50" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.h1
            className="font-display text-4xl sm:text-5xl md:text-6xl text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Story
          </motion.h1>
          <motion.p
            className="font-elegant text-xl sm:text-2xl text-gold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Where Fashion Meets Passion
          </motion.p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Story */}
        <section className="max-w-3xl mx-auto text-center mb-20 sm:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">The Beginning</p>
            <h2 className="font-display text-3xl sm:text-4xl text-charcoal mb-6">From Yavatmal to All India</h2>
            <p className="text-charcoal/60 text-base sm:text-lg leading-relaxed mb-4">
              Fashion 2 Gether started with a simple vision — to bring premium, trend-setting fashion to every woman across India. What began as a small store in Yavatmal has grown into a beloved fashion destination, known for our curated collections and exceptional quality.
            </p>
            <p className="text-charcoal/60 text-base sm:text-lg leading-relaxed">
              We believe that fashion is not just about clothes — it's about confidence, self-expression, and the joy of feeling beautiful. Every piece in our collection is handpicked to ensure it meets our standards of quality, style, and value.
            </p>
          </motion.div>
        </section>

        {/* Values */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 sm:mb-28">
          {[
            { icon: Heart, title: 'Curated With Love', desc: 'Every piece is handpicked by our style experts' },
            { icon: Award, title: 'Premium Quality', desc: 'Only the finest fabrics and craftsmanship' },
            { icon: Truck, title: 'All India Shipping', desc: 'Delivering fashion to your doorstep, anywhere' },
            { icon: Globe, title: 'Trend Forward', desc: 'Always ahead with the latest fashion trends' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="text-center p-6 sm:p-8 bg-off-white rounded-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <item.icon size={28} className="text-gold mx-auto mb-4" />
              <h3 className="font-display text-lg text-charcoal mb-2">{item.title}</h3>
              <p className="text-sm text-charcoal/50">{item.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Instagram Presence */}
        <section className="text-center mb-20 sm:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Community</p>
            <h2 className="font-display text-3xl sm:text-4xl text-charcoal mb-4">Join Our Fashion Family</h2>
            <p className="text-charcoal/60 text-base max-w-xl mx-auto mb-8">
              With thousands of happy customers and a thriving Instagram community, Fashion 2 Gether is more than a store — it's a movement.
            </p>
            <a
              href="https://instagram.com/fashion2gether"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
            >
              FOLLOW @FASHION2GETHER
            </a>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="text-center py-16 bg-charcoal rounded-sm px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">Ready to Explore?</h2>
            <p className="text-white/60 mb-8">Discover our latest collections and find your perfect style.</p>
            <Link to="/shop" className="btn-primary bg-gold text-white hover:bg-gold-light">
              SHOP NOW
            </Link>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
