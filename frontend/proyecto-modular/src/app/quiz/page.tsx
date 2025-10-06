"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "../context/UserContext"

interface Quiz {
  id_quiz: number
  quiz_name: string
  question: string
  quiz_level: string
}

interface Answer_Quiz {
  id_answer_quiz: number
  answer_text: string
  is_correct: boolean
  id_quiz: number
}

export default function QuizPage() {
  const [quizes, setQuizes] = useState<Quiz[]>([])
  const [quizAnswersMap, setQuizAnswersMap] = useState<Record<number, Answer_Quiz[]>>({})
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const { user } = useUser()
  const router = useRouter()

  // 🔹 Verificar si ya tiene nivel
  useEffect(() => {
    const VerificarNivel = async () => {
      if (!user?.id_user) return
      try {
        const res = await fetch(`http://localhost:8000/user/${user.id_user}/level`)
        if (res.ok) {
          const data = await res.json()
          if (data?.Nivel) {
            // ✅ Ya tiene nivel → Redirigir directamente al inicio
            router.push("/principal")
            return
          }
        }
      } catch (error) {
        console.error("Error al verificar nivel:", error)
      }
      // 🔹 Si no tiene nivel, cargar quiz
      ObtenerQuizes()
    }

    VerificarNivel()
  }, [user?.id_user])

  // 🔹 Cargar quizes y respuestas
  const ObtenerQuizes = async () => {
    try {
      const res = await fetch("http://localhost:8000/quizes")
      const data: Quiz[] = await res.json()
      setQuizes(data)

      const answersMap: Record<number, Answer_Quiz[]> = {}
      await Promise.all(
        data.map(async (quiz) => {
          const resAns = await fetch(`http://localhost:8000/quiz/${quiz.id_quiz}/answer`)
          const ansData = await resAns.json()
          answersMap[quiz.id_quiz] = ansData.answers
        })
      )
      setQuizAnswersMap(answersMap)
    } catch (error) {
      console.error("Error al cargar quizes:", error)
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Manejar selección de respuestas
  const handleSelectAnswer = (quizId: number, answerId: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [quizId]: answerId }))
  }

  // 🔹 Subir respuestas al backend
  const SubirRespuestas = async () => {
    if (!user?.id_user) {
      alert("❌ No se encontró el ID del usuario. Inicia sesión antes de enviar tus respuestas.")
      return
    }

    const answers = Object.entries(selectedAnswers).map(([quizId, answerId]) => ({
      id_quiz: Number(quizId),
      id_answer_quiz: Number(answerId),
    }))

    if (answers.length === 0) {
      alert("Selecciona al menos una respuesta antes de enviar.")
      return
    }

    const response = await fetch("http://localhost:8000/submit-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_user: user.id_user, answers }),
    })

    if (response.ok) {
      const data = await response.json()
      router.push("/principal")
    } else {
      const errorData = await response.json()
      alert("❌ Error al enviar respuestas: " + errorData.detail)
    }
  }

  if (loading) {
  return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-white">
        <img
            src="/images/logo.jpg"
            alt="Logo"
            className="w-32 h-32 mb-4 rounded-full shadow-lg border-4 border-[#6D4C41] animate-bounce"
        />
        <p className="text-lg font-semibold text-[#6D4C41]">Cargando...</p>
        </div>
    )
    }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-[#5D4037] mb-4">
          Test de Nivel de Inglés
        </h1>
        <p className="text-lg text-gray-700">
          Este es un pequeño examen para calcular tu nivel de inglés. 
          Consta de <span className="font-semibold">3 ejercicios</span> 
          para cada nivel: <span className="font-bold">A1, A2, B1, B2 y C1</span>. 
          Responde con calma para conocer en qué nivel te encuentras.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {quizes.map((quiz) => {
          const imageUrl = `/images/quiz/${quiz.quiz_name.replace(/\s+/g, "_").toLowerCase()}.jpg`
          const answers = quizAnswersMap[quiz.id_quiz] || []

          return (
            <div 
              key={quiz.id_quiz} 
              className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center hover:shadow-2xl transition"
            >
              <img 
                src={imageUrl} 
                alt={quiz.quiz_name} 
                className="w-48 h-32 object-cover rounded-lg mb-4"
              />
              <p className="font-semibold text-gray-800 text-lg mb-2">
                {quiz.question}
              </p>

              <ul className="w-full space-y-2">
                {answers.map((answer) => (
                  <li 
                    key={answer.id_answer_quiz} 
                    onClick={() => handleSelectAnswer(quiz.id_quiz, answer.id_answer_quiz)}
                    className={`p-2 rounded-lg cursor-pointer transition 
                      ${selectedAnswers[quiz.id_quiz] === answer.id_answer_quiz 
                        ? "bg-blue-500 text-white" 
                        : "bg-gray-100 hover:bg-blue-100 text-gray-800"}`}
                  >
                    {answer.answer_text}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="flex justify-center mt-12">
        <button 
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:from-blue-500 hover:to-blue-300 transition-transform transform hover:scale-105 active:scale-95"
          onClick={SubirRespuestas}
        >
          Subir Respuestas
        </button>
      </div>
    </div>
  )
}
