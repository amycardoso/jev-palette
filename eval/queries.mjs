// Labeled eval set: 50 queries → expected command id.
// Three slices, on purpose:
//   pt-intent  (25): intent phrased in Portuguese — no lexical overlap with labels
//   en-intent  (15): intent phrased in English, still not the command's name
//   name       (10): name-like queries where classic fuzzy matching is strong
// The "name" slice keeps the eval honest: fuzzy is expected to win it on speed
// and tie on accuracy; the intent slices are where the semantic gap shows.

export const QUERIES = [
  // --- pt-intent ---
  { q: 'jogar fora essa mensagem', expected: 'delete_message', category: 'pt-intent' },
  { q: 'deixar a letra maior', expected: 'increase_font', category: 'pt-intent' },
  { q: 'diminuir o tamanho do texto', expected: 'decrease_font', category: 'pt-intent' },
  { q: 'avisar que estou de férias', expected: 'vacation_responder', category: 'pt-intent' },
  { q: 'mandar depois, não agora', expected: 'schedule_send', category: 'pt-intent' },
  { q: 'sumir com tudo que já li', expected: 'archive_all_read', category: 'pt-intent' },
  { q: 'deixar a tela escura', expected: 'toggle_dark_mode', category: 'pt-intent' },
  { q: 'desfazer o que eu fiz', expected: 'undo', category: 'pt-intent' },
  { q: 'quero escrever um email novo', expected: 'new_message', category: 'pt-intent' },
  { q: 'marcar como não lida', expected: 'mark_unread', category: 'pt-intent' },
  { q: 'colocar estrela nessa mensagem', expected: 'star_message', category: 'pt-intent' },
  { q: 'isso é golpe, denunciar', expected: 'report_spam', category: 'pt-intent' },
  { q: 'nunca mais receber email dessa pessoa', expected: 'block_sender', category: 'pt-intent' },
  { q: 'responder para todo mundo', expected: 'reply_all', category: 'pt-intent' },
  { q: 'guardar o rascunho', expected: 'save_draft', category: 'pt-intent' },
  { q: 'colocar um arquivo no email', expected: 'attach_file', category: 'pt-intent' },
  { q: 'ver os emails apagados', expected: 'go_trash', category: 'pt-intent' },
  { q: 'trocar minha senha', expected: 'change_password', category: 'pt-intent' },
  { q: 'sair da conta', expected: 'sign_out', category: 'pt-intent' },
  { q: 'deixar o texto em negrito', expected: 'bold_text', category: 'pt-intent' },
  { q: 'esvaziar a lixeira de vez', expected: 'empty_trash', category: 'pt-intent' },
  { q: 'adiar essa mensagem para amanhã', expected: 'snooze_message', category: 'pt-intent' },
  { q: 'silenciar essa conversa', expected: 'mute_thread', category: 'pt-intent' },
  { q: 'traduzir esse email', expected: 'translate_message', category: 'pt-intent' },
  { q: 'procurar um email antigo', expected: 'search_mail', category: 'pt-intent' },

  // --- en-intent ---
  { q: 'make it dark in here', expected: 'toggle_dark_mode', category: 'en-intent' },
  { q: 'throw this away', expected: 'delete_message', category: 'en-intent' },
  { q: 'make the text bigger', expected: 'increase_font', category: 'en-intent' },
  { q: "let people know I'm on holiday", expected: 'vacation_responder', category: 'en-intent' },
  { q: 'send this later tonight', expected: 'schedule_send', category: 'en-intent' },
  { q: "get rid of everything I've read", expected: 'archive_all_read', category: 'en-intent' },
  { q: 'I never want to hear from this sender again', expected: 'block_sender', category: 'en-intent' },
  { q: 'put a link on this text', expected: 'insert_link', category: 'en-intent' },
  { q: 'strip all the styling', expected: 'clear_formatting', category: 'en-intent' },
  { q: 'write back to everyone', expected: 'reply_all', category: 'en-intent' },
  { q: 'check for typos', expected: 'check_spelling', category: 'en-intent' },
  { q: 'stuff this into a folder', expected: 'move_to_folder', category: 'en-intent' },
  { q: 'remind me about this email tomorrow', expected: 'snooze_message', category: 'en-intent' },
  { q: "show me what I haven't read", expected: 'toggle_unread_only', category: 'en-intent' },
  { q: 'log me out', expected: 'sign_out', category: 'en-intent' },

  // --- name ---
  { q: 'delete', expected: 'delete_message', category: 'name' },
  { q: 'archive', expected: 'archive_message', category: 'name' },
  { q: 'reply all', expected: 'reply_all', category: 'name' },
  { q: 'dark mode', expected: 'toggle_dark_mode', category: 'name' },
  { q: 'zoom in', expected: 'zoom_in', category: 'name' },
  { q: 'sign out', expected: 'sign_out', category: 'name' },
  { q: 'attach', expected: 'attach_file', category: 'name' },
  { q: 'settings', expected: 'open_settings', category: 'name' },
  { q: 'print', expected: 'print_message', category: 'name' },
  { q: 'undo', expected: 'undo', category: 'name' },
]
