import { ref, remove, update } from "firebase/database";
import { database } from "../services/firebase";

import { useParams, useNavigate } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg"

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";

import { useAuth } from "../hooks/useAuth";

import "../styles/room.scss";
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const params = useParams<RoomParams>()
  const roomId = params.id
  const { questions, title } = useRoom(roomId!)
  const navigate = useNavigate()

  async function handleEndRoom() {
    const roomRef = ref(database, `rooms/${roomId}`)
    update(roomRef, {
      endedAt: new Date()
    })

    navigate('/')
  }

  async function handleDeleQuestionId(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      const questionRef= ref(database, `rooms/${roomId}/questions/${questionId}`)
      remove(questionRef)
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={`${roomId}`} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button 
                type="button"
                onClick={() => handleDeleQuestionId(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
