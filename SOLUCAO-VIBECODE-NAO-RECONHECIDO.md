# ✗ Erro: 'vibecode' não é reconhecido

## Problema
Após instalar com `npm install -g vibecode`, o comando não é encontrado.

## Causa
O PATH do npm global não está configurado no Windows.

---

## ✅ SOLUÇÃO RÁPIDA (Temporária)

Execute no CMD ou PowerShell:

### CMD:
```cmd
for /f "delims=" %i in ('npm config get prefix') do set PATH=%PATH%;%i
vibecode --version
```

### PowerShell:
```powershell
$env:PATH += ";$(npm config get prefix)"
vibecode --version
```

---

## ✅ SOLUÇÃO PERMANENTE

### Opção 1: Script Automático

Execute o arquivo:
```cmd
fix-vibecode-path.bat
```

### Opção 2: Manual

1. **Descubra o caminho do npm:**
   ```cmd
   npm config get prefix
   ```
   Exemplo de resultado: `C:\Users\SeuUsuario\AppData\Roaming\npm`

2. **Adicione ao PATH do Windows:**
   - Pressione `Win + Pause` ou vá em `Painel de Controle > Sistema`
   - Clique em `Configurações avançadas do sistema`
   - Clique em `Variáveis de Ambiente`
   - Em `Variáveis do usuário`, selecione `Path` e clique em `Editar`
   - Clique em `Novo` e adicione o caminho do npm
   - Clique em `OK` em todas as janelas

3. **Reinicie o terminal** e teste:
   ```cmd
   vibecode --version
   ```

---

## ✅ VERIFICAÇÃO

Após configurar, verifique se está funcionando:

```cmd
where vibecode
vibecode --version
```

Deve mostrar:
```
C:\Users\SeuUsuario\AppData\Roaming\npm\vibecode.cmd
vibecode 0.1.0
```

---

## 🔧 Alternativa: Usar npx

Se não quiser configurar o PATH, use:

```cmd
npx vibecode
```

Isso funciona sem configuração adicional!

---

## 📝 Notas

- O PATH precisa ser configurado apenas UMA VEZ
- Após configurar, funciona em qualquer terminal
- Se mudar de usuário Windows, precisa configurar novamente
