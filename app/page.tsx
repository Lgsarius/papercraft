'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  Github,
  Search,
  BookText,
  Quote,
  Brain,
  CheckCircle,
  Zap,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import TypewriterComponent from "typewriter-effect"
import Image from "next/image"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { HTMLMotionProps } from "framer-motion"
import { AnimatedWriting } from "@/components/ui/animated-writing"

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Testimonial {
  name: string;
  title: string;
  image: string;
  quote: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period?: string;
  popular?: boolean;
  features: string[];
}

interface FeatureGridProps {
  features: Feature[];
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

interface MotionDivProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

const MotionDiv: React.FC<MotionDivProps> = motion.div

export default function LandingPage() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  })

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), springConfig)

  return (
    <div className="flex flex-col min-h-screen" ref={targetRef}>
      {/* Hero Section with Enhanced Animations */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            y,
            backgroundImage: "radial-gradient(circle at center, var(--primary) 0%, transparent 70%)",
            opacity: 0.1
          }}
        />
        
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <div className="container relative z-10 flex flex-col items-center space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <motion.h1 
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.span
                className="block"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Wissenschaftliches Schreiben
              </motion.span>
              <motion.div 
                className="text-primary inline-block mt-2"
                animate={{ 
                  scale: [1, 1.02, 1],
                  rotate: [-1, 1, -1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <TypewriterComponent
                  options={{
                    strings: [
                      "leicht gemacht.",
                      "automatisiert.",
                      "revolutioniert.",
                    ],
                    autoStart: true,
                    loop: true,
                    deleteSpeed: 50,
                    delay: 80,
                    wrapperClassName: "typewriter-text",
                    cursorClassName: "typewriter-cursor text-primary",
                  }}
                />
              </motion.div>
            </motion.h1>
            
            {/* Animated features list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mt-6"
            >
              {["KI-Unterstützung", "Automatische Zitation", "Plagiatsprüfung"].map((feature, i) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-2 text-muted-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                  />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.p 
              className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Nutzen Sie KI, um Ihre wissenschaftlichen Arbeiten schneller und effizienter zu schreiben.
              Mit intelligenten Tools für Recherche, Zitation und Textanalyse.
            </motion.p>
          </motion.div>

          {/* Add this CSS to your globals.css */}
          <style jsx global>{`
            .typewriter-cursor {
              animation: blink 1s infinite;
            }
            
            @keyframes blink {
              0% { opacity: 1; }
              50% { opacity: 0; }
              100% { opacity: 1; }
            }
            
            .typewriter-text {
              background: linear-gradient(to right, var(--primary), var(--primary-foreground));
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-size: 200% auto;
              animation: shine 4s linear infinite;
            }
            
            @keyframes shine {
              to {
                background-position: 200% center;
              }
            }
          `}</style>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-x-4"
          >
            <Link href="/signup">
              <Button 
                size="lg" 
                className="h-12 relative overflow-hidden group"
              >
                <motion.span
                  className="absolute inset-0 bg-primary/10"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                Kostenlos starten
                <motion.div
                  className="ml-2"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </Button>
            </Link>
            <Link href="https://github.com/yourusername/papercraft" target="_blank">
              <Button 
                variant="outline" 
                size="lg" 
                className="h-12 relative overflow-hidden group"
              >
                <motion.span
                  className="absolute inset-0 bg-primary/5"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="mr-2"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Github className="h-4 w-4" />
                </motion.div>
                GitHub
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ 
            y: [0, 10, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-6 h-10 border-2 rounded-full flex justify-center p-1">
            <motion.div
              className="w-1 h-2 bg-foreground rounded-full"
              animate={{ 
                y: [0, 16, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </section>
   {/* Writing Demo Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 30% 50%, var(--primary) 0%, transparent 70%)",
            opacity: 0.1
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      {/* Features Grid with Stagger Animation */}
      <section className="py-24 bg-background relative overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 70%)",
            opacity: 0.05
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="container relative z-10">
          <FeatureGrid features={features} />
        </div>
      </section>

      {/* Pricing Section with Floating Cards */}
      <section className="py-24 bg-background relative overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 70%)",
            opacity: 0.05
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight">
              Einfache, transparente Preise
            </h2>
            <p className="mt-4 text-muted-foreground">
              Wählen Sie den Plan, der am besten zu Ihnen passt
            </p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {pricingPlans.map((plan: PricingPlan, i: number) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className={`relative rounded-2xl p-8 shadow-lg ${
                  plan.popular 
                    ? "border-2 border-primary bg-primary/5" 
                    : "border bg-background"
                }`}
              >
                {plan.popular && (
                  <motion.span
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground"
                  >
                    Beliebt
                  </motion.span>
                )}
                <div className="mb-5">
                  <motion.h3 
                    className="text-xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {plan.name}
                  </motion.h3>
                  <p className="mt-2 text-muted-foreground">{plan.description}</p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                </div>
                <motion.ul 
                  className="mb-8 space-y-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  {plan.features.map((feature, index) => (
                    <motion.li 
                      key={feature}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                      className="flex items-center"
                    >
                      <CheckCircle className="mr-3 h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                <Button 
                  className="w-full relative overflow-hidden group"
                  variant={plan.popular ? "default" : "outline"}
                >
                  <motion.span
                    className="absolute inset-0 bg-primary/10"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  Jetzt starten
                  <motion.div
                    className="ml-2"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

   
        
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight">
              Erleben Sie die Zukunft des wissenschaftlichen Schreibens
            </h2>
            <p className="mt-4 text-muted-foreground">
              Sehen Sie selbst, wie PaperCraft Ihre Arbeit revolutioniert
            </p>
          </motion.div>

          <AnimatedWriting />
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-16 border-t">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Häufig gestellte Fragen
            </h2>
            <p className="mt-4 text-muted-foreground">
              Finden Sie Antworten auf die wichtigsten Fragen
            </p>
          </div>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible>
              {faqs.map((faq, i) => (
                <AccordionItem key={`faq-${i}`} value={`faq-${i}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h4 className="font-semibold">Produkt</h4>
            <ul className="space-y-2">
              <li><Link href="/features">Features</Link></li>
              <li><Link href="/pricing">Preise</Link></li>
              <li><Link href="/docs">Dokumentation</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Unternehmen</h4>
            <ul className="space-y-2">
              <li><Link href="/about">Über uns</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/careers">Karriere</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Rechtliches</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy">Datenschutz</Link></li>
              <li><Link href="/terms">AGB</Link></li>
              <li><Link href="/imprint">Impressum</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Kontakt</h4>
            <ul className="space-y-2">
              <li><Link href="/contact">Kontakt</Link></li>
              <li><Link href="/support">Support</Link></li>
              <li><Link href="/status">Status</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features: Feature[] = [
  {
    title: "KI-gestützte Recherche",
    description: "Finden Sie relevante Quellen schnell und effizient mit unserer KI-Technologie.",
    icon: <Search className="h-6 w-6 text-primary" />,
  },
  {
    title: "Intelligentes Zitieren",
    description: "Automatische Zitaterkennung und -formatierung in allen gängigen Zitierstilen.",
    icon: <Quote className="h-6 w-6 text-primary" />,
  },
  {
    title: "Strukturierte Gliederung",
    description: "Erstellen Sie professionelle Gliederungen mit intelligenten Vorlagen.",
    icon: <BookText className="h-6 w-6 text-primary" />,
  },
  {
    title: "KI-Assistent",
    description: "Ihr persönlicher Schreibassistent hilft bei Formulierungen und Korrekturen.",
    icon: <Brain className="h-6 w-6 text-primary" />,
  },
  {
    title: "Plagiatsprüfung",
    description: "Integrierte Plagiatserkennung für akademische Integrität.",
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
  },
  {
    title: "Echtzeit-Zusammenarbeit",
    description: "Arbeiten Sie nahtlos mit Kommilitonen und Betreuern zusammen.",
    icon: <Zap className="h-6 w-6 text-primary" />,
  },
]

const testimonials: Testimonial[] = [
  {
    name: "Dr. Sarah Schmidt",
    title: "Professorin für Informatik",
    image: "/testimonials/sarah.jpg",
    quote: "PaperCraft hat die Art und Weise, wie meine Studenten ihre Arbeiten schreiben, komplett verändert. Die KI-Unterstützung ist beeindruckend."
  },
  {
    name: "Michael Wagner",
    title: "Doktorand",
    image: "/testimonials/michael.jpg",
    quote: "Die automatische Zitierung und Quellenprüfung spart mir Stunden an Zeit. Ein unverzichtbares Tool für meine Forschung."
  },
  {
    name: "Julia Becker",
    title: "Masterstudentin",
    image: "/testimonials/julia.jpg",
    quote: "Dank PaperCraft konnte ich meine Masterarbeit strukturierter und effizienter schreiben. Die Zusammenarbeit mit meinem Betreuer war noch nie so einfach."
  }
]

const faqs: FAQ[] = [
  {
    question: "Was macht PaperCraft besonders?",
    answer: "PaperCraft kombiniert KI-gestützte Schreibunterstützung mit automatischer Zitierung, Plagiatsprüfung und Echtzeit-Zusammenarbeit in einer intuitiven Plattform."
  },
  {
    question: "Wie funktioniert die KI-Unterstützung?",
    answer: "Unsere KI analysiert Ihren Text in Echtzeit und gibt Vorschläge für bessere Formulierungen, Struktur und wissenschaftlichen Stil. Sie hilft auch bei der Recherche und Quellenauswahl."
  },
  {
    question: "Ist PaperCraft für alle Fachrichtungen geeignet?",
    answer: "Ja, PaperCraft unterstützt alle akademischen Disziplinen mit anpassbaren Zitierformaten und fachspezifischen Schreibrichtlinien."
  },
  {
    question: "Wie sicher sind meine Daten?",
    answer: "Ihre Daten werden verschlüsselt und auf sicheren Servern in Deutschland gespeichert. Wir erfüllen alle DSGVO-Anforderungen und teilen keine Daten mit Dritten."
  },
  {
    question: "Kann ich PaperCraft kostenlos testen?",
    answer: "Ja, Sie können PaperCraft mit unserem kostenlosen Plan testen, der grundlegende Funktionen und bis zu 3 Projekte umfasst."
  }
]

const pricingPlans: PricingPlan[] = [
  {
    name: "Kostenlos",
    description: "Perfekt für den Einstieg",
    price: "€0",
    features: [
      "3 Projekte",
      "KI-Assistent (begrenzt)",
      "Grundlegende Zitierformate",
      "Community Support"
    ]
  },
  {
    name: "Pro",
    description: "Ideal für Studierende",
    price: "€9.99",
    period: "/monat",
    popular: true,
    features: [
      "Unbegrenzte Projekte",
      "Voller KI-Zugriff",
      "Alle Zitierformate",
      "Plagiatsprüfung",
      "Prioritäts-Support",
      "Echtzeit-Zusammenarbeit"
    ]
  },
  {
    name: "Team",
    description: "Für Forschungsgruppen",
    price: "€19.99",
    period: "/monat",
    features: [
      "Alles aus Pro",
      "Team-Verwaltung",
      "Erweiterte Statistiken",
      "API-Zugriff",
      "24/7 Support",
      "Individuelle Schulung"
    ]
  }
]

// New component for Features with stagger animation
function FeatureGrid({ features }: FeatureGridProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={ref}
      className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {features.map((feature: Feature, i: number) => (
        <motion.div
          key={feature.title}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-lg border bg-background p-6 group hover:border-primary/50"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="absolute inset-0 bg-primary/5"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            {feature.icon}
          </motion.div>
          <h3 className="mt-4 font-semibold">{feature.title}</h3>
          <p className="mt-2 text-muted-foreground">{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrent((current + newDirection + testimonials.length) % testimonials.length)
  }

  return (
    <div className="relative h-[400px] w-full">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x)

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1)
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1)
            }
          }}
          className="absolute w-full"
        >
          <motion.div
            className="bg-card rounded-xl p-6 shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative h-16 w-16">
                <Image
                  src={testimonials[current].image}
                  alt={testimonials[current].name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {testimonials[current].name}
                </h3>
                <p className="text-muted-foreground">
                  {testimonials[current].title}
                </p>
              </div>
            </div>
            <blockquote className="text-lg italic">
              "{testimonials[current].quote}"
            </blockquote>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
        {testimonials.map((_, index) => (
          <motion.button
            key={index}
            className={`w-2 h-2 rounded-full ${
              current === index ? "bg-primary" : "bg-primary/20"
            }`}
            onClick={() => {
              setDirection(index > current ? 1 : -1)
              setCurrent(index)
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12"
        onClick={() => paginate(-1)}
      >
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-primary/10"
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.div>
      </button>

      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12"
        onClick={() => paginate(1)}
      >
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-primary/10"
        >
          <ChevronRight className="h-6 w-6" />
        </motion.div>
      </button>
    </div>
  )
}
