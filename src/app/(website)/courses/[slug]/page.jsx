import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Clock,
  CheckCircle,
  ArrowLeft,
  ShieldCheck,
  Users,
  Calendar,
  BookOpen,
  Award,
  PlayCircle,
  ChevronRight,
  Target,
  Phone
} from "lucide-react";
import PageHero from "@/components/website/PageHero";
import { getCourseBySlug, getCourses } from "@/lib/queries/courses";
import { getSiteSettings } from "@/lib/queries/settings";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) {
    return { title: "Course Not Found" };
  }
  return {
    title: course.title,
    description:
      course.short_description ||
      "MPSC batch details and admissions at Karmayogi Academy Nashik.",
  };
}

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const [course, settings] = await Promise.all([
    getCourseBySlug(slug),
    getSiteSettings(),
  ]);

  if (!course) {
    notFound();
  }

  const phoneNumber = settings?.phone || '+91 93255 89491';
  const phoneHref = `tel:${phoneNumber.replace(/\s/g, '')}`;

  const otherCourses = (await getCourses({ limit: 4 }))
    .filter((c) => c.slug !== slug)
    .slice(0, 3);

  // Batch dates and mode from course data or defaults
  const batchMode = course.batch_mode || 'Offline (Classroom) + Online Doubt Sessions';
  const nextBatchDate = course.next_batch_date || 'January 2027';
  const batchTimings = course.batch_timings || 'Mon–Sat, 8:00 AM – 11:00 AM';

  // Use course.image_url if available, otherwise a placeholder
  const bannerImage = course.image_url || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-20">
      {/* Hero Section */}
      <div 
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-[var(--navy)] text-white"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A] to-[#1e3a8a]/90 z-10" />
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay z-0" />
        </div>
        
        <div className="container-ka relative z-20">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to all courses
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-10 items-center justify-between">
            <div className="max-w-2xl w-full">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-[var(--orange)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {course.admission_status === 'open' ? 'Admissions Open' : 'Admissions Closed'}
                </span>
                <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Clock size={12} />
                  {course.duration || "52 Weeks"}
                </span>
                <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Target size={12} />
                  {course.category || "General"}
                </span>
              </div>
              
              <h1 className="font-playfair text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-sm">
                {course.title}
              </h1>
              
              <p className="text-lg lg:text-xl text-white/90 leading-relaxed mb-8 max-w-xl">
                {course.short_description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="#enroll"
                  className="bg-[var(--orange)] hover:bg-[#d94e07] text-white px-8 py-3.5 rounded-lg font-bold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Book Demo Session
                </Link>
                <Link
                  href="#curriculum"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-3.5 rounded-lg font-bold text-base transition-all"
                >
                  View Curriculum
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block w-full max-w-md relative">
              <div className="relative h-[340px] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <Image
                  src={bannerImage}
                  alt={course.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/90 via-[#1E3A8A]/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-ka pt-16">
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-14 relative items-start">
          
          {/* Main Content Area */}
          <div className="flex-1 w-full space-y-12">
            
            {/* About Program Section */}
            <section id="about" className="scroll-mt-32">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-6 bg-[var(--orange)] rounded-full"></div>
                <h2 className="font-playfair text-3xl font-bold text-[var(--navy)]">About This Program</h2>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div
                  className="prose-ka max-w-none text-gray-700 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{
                    __html: course.description || `<p>${course.short_description}</p>`,
                  }}
                />
              </div>
            </section>

            {/* Feature Grid */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-6 bg-[var(--orange)] rounded-full"></div>
                <h2 className="font-playfair text-3xl font-bold text-[var(--navy)]">What You&apos;ll Get</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: <BookOpen size={24} />,
                    title: "Comprehensive Material",
                    desc: "High-yield printed notes and daily current affairs compendiums."
                  },
                  {
                    icon: <PlayCircle size={24} />,
                    title: "Conceptual Clarity",
                    desc: "Daily 3-hour structured classroom sessions focused on fundamentals."
                  },
                  {
                    icon: <Target size={24} />,
                    title: "Answer Writing Focus",
                    desc: "Exclusive workshops guided by serving officers for Mains exam."
                  },
                  {
                    icon: <Award size={24} />,
                    title: "Continuous Evaluation",
                    desc: "Weekly Prelims OMR and Mains subjective test series."
                  }
                ].map((feature, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="w-12 h-12 bg-blue-50 text-[var(--blue)] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[var(--blue)] group-hover:text-white transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--navy)] mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum/Syllabus Overview */}
            <section id="curriculum" className="scroll-mt-32">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-6 bg-[var(--orange)] rounded-full"></div>
                <h2 className="font-playfair text-3xl font-bold text-[var(--navy)]">Course Structure</h2>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {(course.course_curriculum && course.course_curriculum.length > 0
                  ? course.course_curriculum.map((item) => ({
                      phase: item.phase_name || item.title,
                      duration: item.duration || '',
                      details: item.description || item.topics || '',
                    }))
                  : [
                    { phase: "Phase 1: Foundation & Basics", duration: "Weeks 1–12", details: "Core subjects: History of Maharashtra & India, Geography, Indian Polity, and State Board concepts. Building strong fundamentals." },
                    { phase: "Phase 2: Advanced Syllabus Coverage", duration: "Weeks 13–28", details: "In-depth coverage of Economics, Science & Technology, Environment, Current Affairs integration, and weekly Prelims OMR mock tests." },
                    { phase: "Phase 3: Mains & Answer Writing", duration: "Weeks 29–40", details: "Descriptive answer writing workshops, optional subject guidance, ethics case studies, and Mains-level subjective test series." },
                    { phase: "Phase 4: Revision, Mocks & Interview", duration: "Weeks 41–52", details: "Full-length comprehensive mocks, rapid revision modules, PYQ analysis, and mock interviews conducted by serving officers." },
                  ]
                ).map((item, idx) => (
                  <div key={idx} className="border-b border-gray-100 last:border-0 p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                    <div className="w-full sm:w-1/3">
                      <h3 className="font-bold text-[var(--navy)] text-lg">{item.phase}</h3>
                      <span className="text-sm font-semibold text-[var(--orange)]">{item.duration}</span>
                    </div>
                    <div className="w-full sm:w-2/3 text-gray-600">
                      {item.details}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Batch Details Section */}
            <section className="scroll-mt-32">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-6 bg-[var(--orange)] rounded-full"></div>
                <h2 className="font-playfair text-3xl font-bold text-[var(--navy)]">Batch Details</h2>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <Calendar size={20} className="text-[var(--orange)] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-sm text-[var(--navy)] mb-1">Next Batch Starts</p>
                      <p className="text-sm text-gray-600">{nextBatchDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={20} className="text-[var(--orange)] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-sm text-[var(--navy)] mb-1">Batch Timings</p>
                      <p className="text-sm text-gray-600">{batchTimings}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target size={20} className="text-[var(--orange)] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-sm text-[var(--navy)] mb-1">Mode of Learning</p>
                      <p className="text-sm text-gray-600">{batchMode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Sidebar CTA */}
          <div className="w-full lg:w-[380px] lg:sticky lg:top-32" id="enroll">
            
            {/* Batch Highlights Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden mb-6">
              <div className="bg-gray-50 border-b border-gray-100 p-5">
                <h3 className="font-playfair text-xl font-bold text-[var(--navy)]">Batch Highlights</h3>
              </div>
              <div className="p-5">
                <ul className="space-y-4">
                  {[
                    "Daily 3-hour sessions",
                    "Expert post-holder faculty",
                    "Weekly OMR & Subjective Tests",
                    "Personalized Mentorship"
                  ].map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle size={18} className="text-[var(--orange)] flex-shrink-0 mt-0.5" />
                      <span className="font-medium text-sm leading-snug">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="bg-[var(--navy)] p-6 text-center text-white">
                <h3 className="font-playfair text-2xl font-bold mb-2">Join {course.title}</h3>
                <p className="text-white/80 text-sm">Next batch: {nextBatchDate}. Limited seats available.</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[var(--blue)] flex items-center justify-center flex-shrink-0">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[var(--navy)]">Small Batch Size</p>
                      <p className="text-xs text-gray-500">For 1-on-1 personal guidance</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-orange-50 text-[var(--orange)] flex items-center justify-center flex-shrink-0">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[var(--navy)]">Proven System</p>
                      <p className="text-xs text-gray-500">High success rate in selections</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[var(--navy)]">Duration</p>
                      <p className="text-xs text-gray-500">{course.duration || '52 Weeks'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <Link
                    href="/contact"
                    className="flex w-full items-center justify-center gap-2 bg-[var(--orange)] hover:bg-[#d94e07] text-white font-bold text-[15px] py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Enroll Now
                    <ChevronRight size={18} />
                  </Link>
                  <p className="text-center text-xs text-gray-500 mt-3">
                    Or call us at{' '}
                    <a href={phoneHref} className="text-[var(--orange)] font-semibold hover:underline">
                      {phoneNumber}
                    </a>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Guarantee Card */}
            <div className="mt-6 bg-blue-50 border border-blue-100 p-5 rounded-2xl flex items-start gap-4">
              <Award className="text-[var(--blue)] flex-shrink-0" size={28} />
              <div>
                <h4 className="font-bold text-[var(--navy)] text-sm mb-1">Quality Education Guarantee</h4>
                <p className="text-xs text-gray-600 leading-relaxed">Learn from serving officers and top educators who have cracked the exams themselves.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Other Courses Section */}
        {otherCourses.length > 0 && (
          <div className="mt-24 pt-16 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-[var(--orange)] font-bold text-sm tracking-wider uppercase mb-2 block">Explore More</span>
                <h2 className="font-playfair text-3xl font-bold text-[var(--navy)]">
                  Other Popular Batches
                </h2>
              </div>
              <Link href="/courses" className="text-[var(--blue)] font-semibold hover:underline flex items-center gap-1">
                View all courses <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherCourses.map((c) => (
                <div
                  key={c.slug}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col h-full"
                >
                  <div className="h-2 bg-[var(--navy)] group-hover:bg-[var(--orange)] transition-colors" />
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                        {c.category || 'Batch'}
                      </span>
                      <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                        <Clock size={12} /> {c.duration || '52 Weeks'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--navy)] mb-3 leading-snug group-hover:text-[var(--blue)] transition-colors">
                      <Link href={`/courses/${c.slug}`} className="before:absolute before:inset-0">
                        {c.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-6 flex-1">
                      {c.short_description}
                    </p>
                    
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto text-[var(--blue)] font-semibold text-sm group-hover:text-[var(--orange)] transition-colors">
                      <span>View Details</span>
                      <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
