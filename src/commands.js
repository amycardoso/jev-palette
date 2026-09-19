// Command catalog for the fictional mail app the palette lives in.
// Shared between the browser UI and the Node proxy (plain JS on purpose).
// Labels are in English, like most real-world apps — which is exactly why
// fuzzy matching falls apart when someone types their intent in Portuguese.

export const COMMANDS = [
  // Message
  { id: 'delete_message', label: 'Delete message', description: 'Move the current message to the trash', group: 'Message', icon: '🗑️' },
  { id: 'archive_message', label: 'Archive message', description: 'Archive the current message out of the inbox', group: 'Message', icon: '📦' },
  { id: 'reply', label: 'Reply', description: 'Reply to the sender of the current message', group: 'Message', icon: '↩️' },
  { id: 'reply_all', label: 'Reply all', description: 'Reply to everyone on the current message', group: 'Message', icon: '↩️' },
  { id: 'forward_message', label: 'Forward message', description: 'Send the current message to someone else', group: 'Message', icon: '➡️' },
  { id: 'mark_unread', label: 'Mark as unread', description: 'Mark the current message as not yet read', group: 'Message', icon: '📩' },
  { id: 'mark_read', label: 'Mark as read', description: 'Mark the current message as read', group: 'Message', icon: '📖' },
  { id: 'star_message', label: 'Star message', description: 'Flag the current message as important with a star', group: 'Message', icon: '⭐' },
  { id: 'pin_message', label: 'Pin message', description: 'Keep the current message at the top of the list', group: 'Message', icon: '📌' },
  { id: 'snooze_message', label: 'Snooze message', description: 'Hide the message and bring it back later', group: 'Message', icon: '⏰' },
  { id: 'report_spam', label: 'Report spam', description: 'Mark the current message as junk mail', group: 'Message', icon: '🚫' },
  { id: 'block_sender', label: 'Block sender', description: 'Never receive mail from this sender again', group: 'Message', icon: '⛔' },
  { id: 'print_message', label: 'Print message', description: 'Print the current message on paper', group: 'Message', icon: '🖨️' },
  { id: 'copy_link_message', label: 'Copy link to message', description: 'Copy a shareable link to this message', group: 'Message', icon: '🔗' },
  { id: 'move_to_folder', label: 'Move to folder', description: 'File the current message into a folder', group: 'Message', icon: '📁' },
  { id: 'add_label', label: 'Add label', description: 'Tag the current message with a label', group: 'Message', icon: '🏷️' },
  { id: 'mute_thread', label: 'Mute thread', description: 'Stop notifications for this conversation', group: 'Message', icon: '🔇' },
  { id: 'translate_message', label: 'Translate message', description: 'Translate the message into your language', group: 'Message', icon: '🌐' },
  { id: 'show_original', label: 'Show original', description: 'View the raw source of the message', group: 'Message', icon: '📄' },
  { id: 'download_attachments', label: 'Download attachments', description: 'Save all files attached to this message', group: 'Message', icon: '📎' },

  // Compose
  { id: 'new_message', label: 'New message', description: 'Start writing a new email', group: 'Compose', icon: '✏️' },
  { id: 'send_message', label: 'Send', description: 'Send the message you are writing', group: 'Compose', icon: '📤' },
  { id: 'schedule_send', label: 'Schedule send', description: 'Send the message later at a chosen time', group: 'Compose', icon: '🕐' },
  { id: 'save_draft', label: 'Save draft', description: 'Keep the unfinished message as a draft', group: 'Compose', icon: '💾' },
  { id: 'discard_draft', label: 'Discard draft', description: 'Throw away the message you are writing', group: 'Compose', icon: '🗑️' },
  { id: 'attach_file', label: 'Attach file', description: 'Add a file to the message', group: 'Compose', icon: '📎' },
  { id: 'insert_signature', label: 'Insert signature', description: 'Add your signature to the message', group: 'Compose', icon: '✒️' },
  { id: 'check_spelling', label: 'Check spelling', description: 'Review the text for spelling mistakes', group: 'Compose', icon: '🔤' },
  { id: 'request_read_receipt', label: 'Request read receipt', description: 'Get notified when the recipient opens it', group: 'Compose', icon: '👁️' },
  { id: 'add_cc_bcc', label: 'Add Cc/Bcc', description: 'Add carbon copy or hidden recipients', group: 'Compose', icon: '👥' },

  // Editor
  { id: 'undo', label: 'Undo', description: 'Revert the last change you made', group: 'Editor', icon: '↶' },
  { id: 'redo', label: 'Redo', description: 'Reapply the change you just undid', group: 'Editor', icon: '↷' },
  { id: 'bold_text', label: 'Bold', description: 'Make the selected text bold', group: 'Editor', icon: '𝐁' },
  { id: 'italic_text', label: 'Italic', description: 'Make the selected text italic', group: 'Editor', icon: '𝘐' },
  { id: 'underline_text', label: 'Underline', description: 'Underline the selected text', group: 'Editor', icon: 'U̲' },
  { id: 'increase_font', label: 'Increase font size', description: 'Make the text bigger', group: 'Editor', icon: '🔎' },
  { id: 'decrease_font', label: 'Decrease font size', description: 'Make the text smaller', group: 'Editor', icon: '🔍' },
  { id: 'insert_link', label: 'Insert link', description: 'Turn the selected text into a hyperlink', group: 'Editor', icon: '🔗' },
  { id: 'insert_image', label: 'Insert image', description: 'Place a picture into the message body', group: 'Editor', icon: '🖼️' },
  { id: 'bulleted_list', label: 'Bulleted list', description: 'Start a list with bullet points', group: 'Editor', icon: '•' },
  { id: 'numbered_list', label: 'Numbered list', description: 'Start a list with numbers', group: 'Editor', icon: '1.' },
  { id: 'clear_formatting', label: 'Clear formatting', description: 'Remove all text styling from the selection', group: 'Editor', icon: '🧹' },
  { id: 'insert_emoji', label: 'Insert emoji', description: 'Add an emoji to the text', group: 'Editor', icon: '🙂' },
  { id: 'quote_text', label: 'Quote', description: 'Format the selection as a quotation', group: 'Editor', icon: '❝' },

  // Navigation
  { id: 'go_inbox', label: 'Go to Inbox', description: 'Open the inbox folder', group: 'Navigation', icon: '📥' },
  { id: 'go_sent', label: 'Go to Sent', description: 'Open the folder of messages you sent', group: 'Navigation', icon: '📤' },
  { id: 'go_drafts', label: 'Go to Drafts', description: 'Open your unfinished messages', group: 'Navigation', icon: '📝' },
  { id: 'go_trash', label: 'Go to Trash', description: 'Open the folder of deleted messages', group: 'Navigation', icon: '🗑️' },
  { id: 'go_spam', label: 'Go to Spam', description: 'Open the junk mail folder', group: 'Navigation', icon: '🚫' },
  { id: 'go_starred', label: 'Go to Starred', description: 'See the messages you starred', group: 'Navigation', icon: '⭐' },
  { id: 'go_calendar', label: 'Open calendar', description: 'Switch to the calendar view', group: 'Navigation', icon: '📅' },
  { id: 'go_contacts', label: 'Open contacts', description: 'See your address book', group: 'Navigation', icon: '👤' },
  { id: 'next_message', label: 'Next message', description: 'Jump to the following message', group: 'Navigation', icon: '⬇️' },
  { id: 'previous_message', label: 'Previous message', description: 'Jump back to the message before', group: 'Navigation', icon: '⬆️' },

  // View
  { id: 'toggle_dark_mode', label: 'Toggle dark mode', description: 'Switch between light and dark appearance', group: 'View', icon: '🌙' },
  { id: 'zoom_in', label: 'Zoom in', description: 'Magnify the whole interface', group: 'View', icon: '➕' },
  { id: 'zoom_out', label: 'Zoom out', description: 'Shrink the whole interface', group: 'View', icon: '➖' },
  { id: 'toggle_sidebar', label: 'Toggle sidebar', description: 'Show or hide the folder sidebar', group: 'View', icon: '◧' },
  { id: 'toggle_preview_pane', label: 'Toggle preview pane', description: 'Show or hide the reading pane', group: 'View', icon: '⬒' },
  { id: 'compact_density', label: 'Compact density', description: 'Fit more messages on screen', group: 'View', icon: '☰' },
  { id: 'fullscreen', label: 'Enter full screen', description: 'Expand the app to fill the display', group: 'View', icon: '⛶' },
  { id: 'toggle_unread_only', label: 'Show unread only', description: 'Filter the list to unread messages', group: 'View', icon: '🔵' },

  // Organize
  { id: 'search_mail', label: 'Search mail', description: 'Find messages by keyword', group: 'Organize', icon: '🔍' },
  { id: 'create_filter', label: 'Create filter', description: 'Automatically sort incoming mail with rules', group: 'Organize', icon: '⚗️' },
  { id: 'create_folder', label: 'Create folder', description: 'Make a new folder for filing mail', group: 'Organize', icon: '📁' },
  { id: 'empty_trash', label: 'Empty trash', description: 'Permanently erase all deleted messages', group: 'Organize', icon: '🧨' },
  { id: 'select_all', label: 'Select all', description: 'Select every message in the list', group: 'Organize', icon: '☑️' },
  { id: 'archive_all_read', label: 'Archive all read', description: 'Sweep every read message out of the inbox', group: 'Organize', icon: '🧹' },
  { id: 'sort_by_date', label: 'Sort by date', description: 'Order messages from newest to oldest', group: 'Organize', icon: '📆' },
  { id: 'sort_by_sender', label: 'Sort by sender', description: 'Group the list by who sent each message', group: 'Organize', icon: '👤' },

  // Account & settings
  { id: 'open_settings', label: 'Open settings', description: 'Change the app preferences', group: 'Settings', icon: '⚙️' },
  { id: 'notification_settings', label: 'Notification settings', description: 'Choose when the app alerts you', group: 'Settings', icon: '🔔' },
  { id: 'vacation_responder', label: 'Vacation responder', description: 'Auto-reply while you are away or on holiday', group: 'Settings', icon: '🏖️' },
  { id: 'change_password', label: 'Change password', description: 'Set a new password for your account', group: 'Settings', icon: '🔑' },
  { id: 'add_account', label: 'Add account', description: 'Connect another email account', group: 'Settings', icon: '➕' },
  { id: 'sign_out', label: 'Sign out', description: 'Leave your account on this device', group: 'Settings', icon: '🚪' },
  { id: 'keyboard_shortcuts', label: 'Keyboard shortcuts', description: 'See the list of key combinations', group: 'Settings', icon: '⌨️' },
  { id: 'sync_now', label: 'Sync now', description: 'Refresh and fetch new mail immediately', group: 'Settings', icon: '🔄' },
  { id: 'open_help', label: 'Help', description: 'Read the documentation and get support', group: 'Settings', icon: '❓' },
]
