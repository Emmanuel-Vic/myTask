import { useEffect, useState } from 'react'

import "./Roda.css";

const Roda = () => {


  const [mostrarNavbar, setMostrarNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const chegouNoFinal =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;

      setMostrarNavbar(chegouNoFinal);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);  


  return (
    <footer className={`Rodap ${mostrarNavbar ? "visivel" : "oculta"}`}>
        {/*<div className='Object-Inside'>
            
            <div className='Contato textRoda'>
                 Contato 
                <h3 className='til'>Nossos Contato:</h3>
                <p>Telefone: (11) 4002-8922</p>
            </div>
            
            <div className='Local textRoda'>
                 Local 
                <h3 className='til'>Nossa Localização:</h3>
                <p>📍SÃO PEDRO DO BUTIA RS (TAIPÃO FUNDO)</p>
            </div>
            
            <div className='Redes textRoda'>
                 Redes 
                <h3 className='til'>Nossas Redes Sociais:</h3>
                <a href="https://www.instagram.com/sitiodascapivara/" target='_blank'>
                    <i class="fab fa-instagram"></i>
                </a>
            </div>
        </div>
        */}
        <hr className='Briake' />
        <div className='CopyR'>
            <p>&copy; 2026 - Todos os direitos reservados</p>
        </div>
        <hr className='Briake' />
    </footer>
  )
}

export default Roda