/**
 * AgroFuturo 2026 - Scripts Avançados de Interatividade e Acessibilidade
 */

document.addEventListener("DOMContentLoaded", () => {
    initAccordion();
    initAcessibilidade();
    initValidacaoFormulario();
    initComentarios();
});

/**
 * 1. COMPONENTE ACORDEON (Totalmente Acessível com Controle de Altura Fluida)
 */
function initAccordion() {
    const headers = document.querySelectorAll(".accordion-header");

    headers.forEach(header => {
        header.addEventListener("click", () => {
            const isExpanded = header.getAttribute("aria-expanded") === "true";
            const content = document.getElementById(header.getAttribute("aria-controls"));

            // Fecha todos os outros painéis (Comportamento clássico de sanfona)
            headers.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.setAttribute("aria-expanded", "false");
                    const otherContent = document.getElementById(otherHeader.getAttribute("aria-controls"));
                    otherContent.style.maxHeight = null;
                    otherContent.setAttribute("hidden", "");
                }
            });

            // Alterna o painel clicado
            if (isExpanded) {
                header.setAttribute("aria-expanded", "false");
                content.style.maxHeight = null;
                // Aguarda o término da animação CSS para aplicar o atributo hidden de acessibilidade
                setTimeout(() => {
                    if (header.getAttribute("aria-expanded") === "false") {
                        content.setAttribute("hidden", "");
                    }
                }, 350);
            } else {
                content.removeAttribute("hidden");
                header.setAttribute("aria-expanded", "true");
                // Define dinamicamente a propriedade max-height com base na altura real interna do conteúdo
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
}

/**
 * 2. ARQUITETURA DE ACESSIBILIDADE COMPLETA (Speech Synthesis, Fontes e Temas)
 */
function initAcessibilidade() {
    const btnToggleMenu = document.getElementById("btn-acessibilidade-toggle");
    const menuOpcoes = document.getElementById("menu-acessibilidade-opcoes");
    
    const btnAumentarFonte = document.getElementById("btn-fonte-aumentar");
    const btnDiminuirFonte = document.getElementById("btn-fonte-diminuir");
    const btnTemaToggle = document.getElementById("btn-tema-toggle");
    const btnVozIniciar = document.getElementById("btn-voz-init"); // Correção do ID dinâmico se necessário
    const btnVozStart = document.getElementById("btn-voz-iniciar");
    const btnVozStop = document.getElementById("btn-voz-parar");

    // Gerenciamento de abertura do menu flutuante
    btnToggleMenu.addEventListener("click", () => {
        const visivel = !menuOpcoes.hasAttribute("hidden");
        if (visivel) {
            menuOpcoes.setAttribute("hidden", "");
            btnToggleMenu.setAttribute("aria-expanded", "false");
        } else {
            menuOpcoes.removeAttribute("hidden");
            btnToggleMenu.setAttribute("aria-expanded", "true");
        }
    });

    // Controle do Tamanho da Fonte por Rem Multiplicador
    let multiplicadorFonte = 1.0;
    const raizHtml = document.documentElement;

    btnAumentarFonte.addEventListener("click", () => {
        if (multiplicadorFonte < 1.4) {
            multiplicadorFonte += 0.1;
            raizHtml.style.fontSize = `${multiplicadorFonte * 16}px`;
        }
    });

    btnDiminuirFonte.addEventListener("click", () => {
        if (multiplicadorFonte > 0.85) {
            multiplicadorFonte -= 0.1;
            raizHtml.style.fontSize = `${multiplicadorFonte * 16}px`;
        }
    });

    // Toggle de Modo Escuro / Claro
    btnTemaToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    // Mecanismo de Leitura de Voz Nativa por SpeechSynthesis API
    let sinteseVoz = window.speechSynthesis;
    let expressaoUtterance = null;

    if (!sinteseVoz) {
        btnVozStart.style.display = "none";
        btnVozStop.style.display = "none";
        console.warn("SpeechSynthesis API não suportada neste navegador.");
        return;
    }

    btnVozStart.addEventListener("click", () => {
        // Interrompe leituras anteriores ativas
        sinteseVoz.cancel();

        // REQUISITO ESTRITO: Capturar apenas o conteúdo textual estrutural principal, ignorando menus, forms e botões.
        const artigoDestaque = document.getElementById("tecnologia-brasil").innerText;
        const secaoBeneficios = document.getElementById("beneficios-ia").querySelector(".ia-header-bloco").innerText;
        
        // Coleta os textos dos blocos do acordeon
        let textoAcordeon = "";
        document.querySelectorAll(".accordion-item").forEach(item => {
            const titulo = item.querySelector(".titulo-painel").innerText;
            const corpo = item.querySelector(".accordion-body").innerText;
            textoAcordeon += ` . Benefício: ${titulo} . ${corpo}`;
        });

        const textoCompletoParaLeitura = `${artigoDestaque} . Próxima Seção: ${secaoBeneficios} . Detalhes dos benefícios: ${textoAcordeon}`;

        expressaoUtterance = new SpeechSynthesisUtterance(textoCompletoParaLeitura);
        expressaoUtterance.lang = "pt-BR";
        expressaoUtterance.rate = 1.0; // Velocidade natural

        // Controle de Estado dos botões durante a reprodução
        expressaoUtterance.onstart = () => {
            btnVozStart.disabled = true;
            btnVozStop.disabled = false;
        };

        expressaoUtterance.onend = () => {
            btnVozStart.disabled = false;
            btnVozStop.disabled = true;
        };

        expressaoUtterance.onerror = () => {
            btnVozStart.disabled = false;
            btnVozStop.disabled = true;
        };

        sinteseVoz.speak(expressaoUtterance);
    });

    btnVozStop.addEventListener("click", () => {
        sinteseVoz.cancel();
        btnVozStart.disabled = false;
        btnVozStop.disabled = true;
    });

    // Cancela a voz se o usuário fechar ou sair da página repentinamente
    window.addEventListener("beforeunload", () => {
        sinteseVoz.cancel();
    });
}

/**
 * 3. VALIDAÇÃO AVANÇADA DE FORMULÁRIO (UX Premium & Sem Recarregamento)
 */
function initValidacaoFormulario() {
    const formulario = document.getElementById("form-inscricao");
    const alertaSucesso = document.getElementById("sucesso-inscricao");

    const campos = {
        nome: { el: document.getElementById("nome"), erro: document.getElementById("erro-nome") },
        email: { el: document.getElementById("email"), erro: document.getElementById("erro-email") },
        cidade: { el: document.getElementById("cidade"), erro: document.getElementById("erro-cidade") },
        estado: { el: document.getElementById("estado"), erro: document.getElementById("erro-estado") }
    };

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        let formularioValido = true;

        // Validação Nome Completo
        if (campos.nome.el.value.trim().length < 5) {
            exibirErro(campos.nome, "Por favor, digite seu nome completo.");
            formularioValido = false;
        } else {
            limparErro(campos.nome);
        }

        // Validação Email por RegEx
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(campos.email.el.value.trim())) {
            exibirErro(campos.email, "Insira um endereço de e-mail corporativo válido.");
            formularioValido = false;
        } else {
            limparErro(campos.email);
        }

        // Validação Cidade
        if (campos.cidade.el.value.trim() === "") {
            exibirErro(campos.cidade, "Campo obrigatório.");
            formularioValido = false;
        } else {
            limparErro(campos.cidade);
        }

        // Validação Estado (UF de 2 caracteres)
        if (campos.estado.el.value.trim().length !== 2) {
            exibirErro(campos.estado, "UF inválida.");
            formularioValido = false;
        } else {
            limparErro(campos.estado);
        }

        if (formularioValido) {
            formulario.reset();
            alertaSucesso.removeAttribute("hidden");
            // Esconde a mensagem de sucesso de forma suave após 6 segundos
            setTimeout(() => {
                alertaSucesso.setAttribute("hidden", "");
            }, 6000);
        }
    });

    // Remove classes de erro assim que o usuário digita nos inputs para melhor experiência
    Object.values(campos).forEach(campo => {
        campo.el.addEventListener("input", () => {
            if (campo.el.classList.contains("campo-invalido")) {
                limparErro(campo);
            }
        });
    });

    function exibirErro(campoObj, mensagem) {
        campoObj.el.classList.add("campo-invalido");
        campoObj.erro.textContent = mensagem;
        campoObj.el.setAttribute("aria-invalid", "true");
    }

    function limparErro(campoObj) {
        campoObj.el.classList.remove("campo-invalido");
        campoObj.erro.textContent = "";
        campoObj.el.removeAttribute("aria-invalid");
    }
}

/**
 * 4. ÁREA DE COMENTÁRIOS E INTERAÇÃO REALTIME SINTÉTICA
 */
function initComentarios() {
    const formComentario = document.getElementById("form-comentario");
    const txtComentario = document.getElementById("txt-comentario");
    const containerLista = document.getElementById("lista-comentarios");

    formComentario.addEventListener("submit", (e) => {
        e.preventDefault();
        const texto = txtComentario.value.trim();

        if (texto === "") return;

        // Cria a estrutura do novo comentário dinamicamente
        const blocoComentario = document.createElement("div");
        blocoComentario.className = "comentario-item";
        
        const paragrafoTexto = document.createElement("p");
        paragrafoTexto.textContent = texto;

        const divMeta = document.createElement("div");
        divMeta.className = "comentario-meta";
        
        const dataAtual = new Date();
        divMeta.textContent = `Enviado por Leitor Anônimo em ${dataAtual.toLocaleDateString('pt-BR')} às ${dataAtual.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;

        blocoComentario.appendChild(paragrafoTexto);
        blocoComentario.appendChild(divMeta);

        // Insere no topo da lista
        containerLista.insertBefore(blocoComentario, containerLista.firstChild);

        // Limpa a caixa de texto
        txtComentario.value = "";
    });
}