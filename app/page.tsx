'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { TypewriterTitle } from "./components/TypewriterTitle";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none mb-4">
                  <TypewriterTitle />
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  PaperCraft hilft Ihnen, Ihre akademischen Arbeiten effizienter und
                  strukturierter zu verfassen.
                </p>
                <motion.div
                  className="mt-8 flex flex-wrap gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button size="lg" asChild>
                    <a href="/signup">Jetzt starten</a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="#features">Mehr erfahren</a>
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                className="relative h-[400px] lg:h-[500px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="https://placehold.co/600x400/png"
                  alt="PaperCraft Dashboard Preview"
                  fill
                  className="object-contain rounded-lg"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <motion.h2
              className="text-3xl font-bold tracking-tighter text-center mb-12"
              {...fadeInUp}
            >
              Alles was Sie für Ihre Hausarbeit brauchen
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Strukturiert Schreiben",
                  description: "Nutzen Sie unsere intelligenten Templates und Gliederungshilfen für eine klare Struktur Ihrer Arbeit."
                },
                {
                  title: "Quellenmanagement",
                  description: "Verwalten Sie Ihre Quellen und Zitate effizient mit unserem integrierten Zitiersystem."
                },
                {
                  title: "KI-Unterstützung",
                  description: "Lassen Sie sich von unserer KI bei der Recherche und Formulierung unterstützen."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { number: "10.000+", label: "Zufriedene Studierende" },
                { number: "50+", label: "Universitäten" },
                { number: "25.000+", label: "Erfolgreich eingereichte Arbeiten" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-4xl font-bold">{stat.number}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
