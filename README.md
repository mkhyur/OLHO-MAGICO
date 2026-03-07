# 👁️ OLHO MAGICO

Bem-vindo ao **OLHO MAGICO**.

Este scanner foi criado para **analisar logs do sistema e identificar uso de proxy ou possíveis bypass relacionados ao Free Fire**.
A análise é feita diretamente nos registros do sistema e mostra de forma clara se existe algum indício de manipulação de rede.

O objetivo é simples: **identificar proxies e manter um cenário limpo no Free Fire.**

O scanner mostra dois diagnósticos principais:

* Uso de **Proxy**
* Possível **Bypass**

Tudo é apresentado em um painel visual fácil de entender.

---

# ⚙️ O que você precisa

Para usar o scanner você precisa de apenas duas coisas:

1. O aplicativo **Scriptable**
2. Um **sysdiagnose (log do sistema)**

Todo o processo é explicado abaixo.

---

# 📱 1️⃣ Instalar o aplicativo Scriptable

1. Abra a **App Store**
2. Procure por **Scriptable**
3. Instale o aplicativo

Depois de instalar, abra o **Scriptable**.

---

# ✏️ 2️⃣ Executar o scanner

Dentro do Scriptable:

1. toque no botão **+** no canto superior direito
2. será criado um **novo script vazio**
3. apague qualquer texto que aparecer
4. cole o código abaixo

```javascript
const OLHO_MAGICO = "https://raw.githubusercontent.com/mkhyur/OLHO-MAGICO/main/scanner.js"

let req = new Request(OLHO_MAGICO)
let code = await req.loadString()

if (!code || code.includes("404")) {
  let alert = new Alert()
  alert.title = "Erro"
  alert.message = "Nao foi possivel baixar o scanner."
  alert.addAction("OK")
  await alert.present()
} else {

  const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
  const run = new AsyncFunction(code + "\n if (typeof main === 'function') await main();")

  await run()
}
```

Depois:

1. toque em **Done**
2. dê um nome ao script (exemplo: **OLHO MAGICO**)
3. salve.

Esse pequeno script apenas **baixa o scanner diretamente do GitHub e executa automaticamente**.

---

# 📊 3️⃣ Gerar o log do sistema (sysdiagnose)

Agora é necessário gerar os **logs do sistema**, chamados de **sysdiagnose**.

Esse log contém registros internos que permitem analisar configurações de rede.

Para gerar o sysdiagnose:

1. segure **Volume +**
2. segure **Volume -**
3. segure o **botão Power**

Pressione os três rapidamente **um após o outro**.

O iPhone não mostra uma tela nova, mas o sistema começa a gerar o log em segundo plano.

A geração pode levar **entre 2 e 10 minutos**.

Durante esse tempo o aparelho pode ficar um pouco mais lento, o que é normal.

---

# 📂 4️⃣ Encontrar o arquivo de log

Depois de alguns minutos:

1. abra **Ajustes**
2. vá em **Privacidade e Segurança**
3. toque em **Análise e Melhorias**
4. toque em **Dados de Análise**

Dentro dessa lista procure arquivos com nome parecido com:

```
sysdiagnose_ano_mes_dia
```

Exemplo:

```
sysdiagnose_2026.03.07
```

Toque no arquivo.

Depois:

1. toque no botão **Compartilhar**
2. salve o arquivo no **Arquivos**.

---

# 📦 5️⃣ Extrair o log

O arquivo geralmente vem compactado.

Para usar o scanner é necessário **extrair o arquivo**.

No aplicativo **Arquivos**:

1. toque no arquivo **sysdiagnose**
2. o iOS irá extrair automaticamente
3. será criada **uma pasta com vários arquivos de log**

Essa pasta é a que será usada pelo scanner.

---

# ▶️ 6️⃣ Executar o scanner

Agora abra novamente o **Scriptable**.

1. toque no script **OLHO MAGICO**
2. toque no botão **Run (▶️)**

O scanner irá abrir um seletor de pasta.

Quando aparecer:

**Escolha a pasta onde os logs do sysdiagnose foram extraídos.**

Depois disso o scanner iniciará a análise automaticamente.

---

# 🔎 7️⃣ Ver o resultado

Após a análise será exibido um painel com o diagnóstico.

O painel possui duas seções principais:

### Diagnóstico de Proxy

🟢 **LIMPO**
ou
🔴 **PROXY DETECTADO**

Caso um proxy seja encontrado, o painel pode mostrar:

* tipo de proxy
* servidor
* porta
* arquivo onde foi identificado

---

### Diagnóstico de Bypass

🟢 **LIMPO**
ou
🔴 **BYPASS DETECTADO**

Se existirem registros suspeitos, eles também aparecerão na lista de resultados.

---

# 📌 Observação

O scanner **não altera nada no dispositivo**.

Ele apenas **analisa arquivos de log** para identificar possíveis sinais de proxy ou bypass.

---

# 👁️ OLHO MAGICO

Scanner de análise de logs para identificar proxies e manter um cenário limpo.
