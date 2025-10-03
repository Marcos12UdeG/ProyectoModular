"use client"
import { useEffect, useState } from "react"

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

    const ObtenerQuizes = async () => {
        const res = await fetch("http://localhost:8000/quizes")
        const data: Quiz[] = await res.json()
        setQuizes(data)

        // Obtener respuestas para cada quiz automáticamente
        const answersMap: Record<number, Answer_Quiz[]> = {}
        await Promise.all(
            data.map(async (quiz) => {
                const resAns = await fetch(`http://localhost:8000/quiz/${quiz.id_quiz}/answer`)
                const ansData = await resAns.json()
                answersMap[quiz.id_quiz] = ansData.answers
            })
        )
        setQuizAnswersMap(answersMap)
    }

    useEffect(() => {
        ObtenerQuizes()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-5xl mx-auto text-center mb-12">
                <h1 className="text-4xl font-extrabold text-brown-700 mb-4">
                    Test de Nivel de Inglés
                </h1>
                <p className="text-lg text-gray-700">
                    Este es un pequeño examen para calcular tu nivel de inglés. 
                    Consta de <span className="font-semibold">3 ejercicios</span> 
                    para cada nivel: <span className="font-bold">A1, A2, B1, B2 y C1</span>. 
                    Responde con calma para conocer en qué nivel te encuentras.
                </p>
            </div>

            {quizes.length === 0 ? (
                <p className="text-center text-gray-600">Cargando preguntas...</p>
            ) : (
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

                                {/* Mostrar respuestas dentro de la misma tarjeta */}
                                <ul className="w-full space-y-2">
                                    {answers.map((answer) => (
                                        <li 
                                            key={answer.id_answer_quiz} 
                                            className="bg-gray-100 p-2 rounded-lg text-gray-800"
                                        >
                                            {answer.answer_text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
