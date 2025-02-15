import { Link } from "react-router-dom"

export default function Learn() {
  const lessons = [
    { id: 1, title: "Introduction to Stocks", difficulty: "Beginner" },
    { id: 2, title: "Understanding Market Trends", difficulty: "Intermediate" },
    { id: 3, title: "Advanced Trading Strategies", difficulty: "Advanced" },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-center">Learn Stock Trading</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="card">
            <h3>{lesson.title}</h3>
            <p className="text-sm text-gray-600 mb-4">Difficulty: {lesson.difficulty}</p>
            <Link to={`/learn/${lesson.id}`} className="btn btn-primary">
              Start Lesson
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

