import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import './Ebook.css';

function Ebook() {
    const navigate = useNavigate();

    const handleOpenPDF = () => {
        window.open('/ebook/ebook-detox7pro.pdf', '_blank');
    };

    return (
        <div className="ebook-container">

            <header className="ebook-header">
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft size={20} />
                    Voltar
                </button>

                <h1>70 Receitas Saudáveis</h1>

                <button className="btn-open-header" onClick={handleOpenPDF}>
                    <BookOpen size={18} />
                    Abrir Ebook
                </button>
            </header>

            <main className="ebook-content">

                <div className="ebook-card">

                    <img
                        src="/ebook/capa-ebook.png"
                        alt="70 Receitas Saudáveis para Revigorar o Corpo"
                        className="ebook-cover"
                    />

                    <div className="ebook-info">
                        <h2>70 Receitas Saudáveis para Revigorar o Corpo</h2>
                        <p>Com mais de 70 receitas leves, nutritivas e fáceis de preparar.</p>

                        <button className="btn-primary-ebook" onClick={handleOpenPDF}>
                            <BookOpen size={18} />
                            Abrir Ebook
                        </button>
                    </div>

                </div>

            </main>
        </div>
    );
}

export default Ebook;