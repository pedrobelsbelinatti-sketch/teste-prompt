Fluxo de validação

Este arquivo resume o fluxo representado em assets/mia-validation-flow.svg.



1. Confirmação inicial

Mia se apresenta
      ↓
confirma se está falando com {{firstName}}
      ↓
┌──────────────┬──────────────┬────────────────┐
│              │              │
positiva     negativa     indeterminada
│              │              │
↓              ↓              ↓
coleta      encerra       esclarece
documento   sem expor     brevemente
            dados             │
                              ↓
                        nova resposta

A confirmação positiva permite continuar para a coleta, mas ainda não valida a identidade.

2. Documento esperado

isCPF = true
      ↓
     CPF

isCPF = false
      ↓
     CNPJ

O tipo vem do contexto renderizado pelo Handlebars.

3. Coleta do documento

documento recebido
      ↓
é possível identificar um único documento esperado
sem inventar ou completar caracteres?
      ↓
┌───────────────┬───────────────┐
│               │
não             sim
│               │
↓               ↓
pedir entrada   preparar chamada
inequívoca      da tool

O prompt orienta a não completar, corrigir ou combinar documentos por inferência.

4. Validação

documento utilizável
      ↓
validate_customer
      ↓
┌────────────────────┬────────────────────┬───────────────────┐
│                    │                    │
validação         cliente não         falha técnica
bem-sucedida      validado             │
│                    │                  │
↓                    ↓                  ↓
encerrar etapa    não liberar       informar que não foi
de validação      produto            possível concluir
      │
      ↓
aplicação pode seguir
para o próximo fluxo

5. Desvios e encerramento

pedido de produto antes da validação
      ↓
explicação breve
      ↓
retomar etapa atual

O fluxo também pode ser encerrado quando houver:

destinatário incorreto
        ↓
     encerrar

recusa / opt-out
        ↓
     encerrar

indicação da aplicação/runtime
        ↓
     encerrar

6. Responsabilidades

Aplicação/runtime
      ↓
estado, políticas e transições

Handlebars
      ↓
renderização do contexto

LLM
      ↓
interpretação da conversa e comunicação

validate_customer
      ↓
resultado da validação de identidade