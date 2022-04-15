import { ref, set, push } from 'firebase/database'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
// import { useAuth } from '../hooks/useAuth';
//webpack // Module Bundler (snowpack, vite, ...)

import "../styles/auth.scss";

export function NewRoom() {

  const navigate = useNavigate()
  const [ newRoom, setNewRoom] = useState('')
  const { user } = useAuth()

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault()

    if(newRoom.trim() === '') {
      return
    }

    const roomRef = ref(database, 'rooms/')
    const newRoomRef = push(roomRef)
    
    set( newRoomRef, {
      title: newRoom,
      authorId: user?.id,
    })


    navigate(`/rooms/${newRoomRef.key}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              type="text" 
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom} />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar numa sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
