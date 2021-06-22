
// see: https://unicode-table.com/en/sets/emoji/
// use Meta-x insert-char

export function SpecialCharactersGVArrows( editor ) {
    let specCharsPlugin = editor.plugins.get( 'SpecialCharacters' );

    specCharsPlugin.addItems( 'Arrows', [
        { title: 'left arrow', character: '←' },
        { title: 'up arrow', character: '↑' },
        { title: 'right arrow', character: '→' },
        { title: 'down arrow', character: '↓' },
	{ title: 'left double arrow', character: '⇐' },
	{ title: 'right double arrow', character: '⇒' },
	{ title: 'up double arrow', character: '⇑' },
	{ title: 'down double arrow', character: '⇓' }
    ] );
}

export function SpecialCharactersGVText( editor ) {
    let specCharsPlugin = editor.plugins.get( 'SpecialCharacters' );

    specCharsPlugin.addItems( 'Text', [
	{ character: '©', title: 'Copyright sign' },
	{ character: '®', title: 'Registered sign' },
	{ character: '™', title: 'Trade mark sign' },
	{ character: '‹', title: 'Single left angle quotation mark' },
	{ character: '›', title: 'Single right angle quotation mark' },
	{ character: '«', title: 'Double left angle quotation mark' },
	{ character: '»', title: 'Double right angle quotation mark' }
    ] );
}

export function SpecialCharactersGVEmojis( editor ) {
    let specCharsPlugin = editor.plugins.get( 'SpecialCharacters' );

    specCharsPlugin.addItems( 'Emojis', [
        { title: 'Smiling', character: '😀' },  // 1F600
        { title: 'Laughing', character: '😂' },  // 1F602
        { title: 'Rolling on floor', character: '🤣' },
        { title: 'Loving', character: '😍' },  // 1f60D
        { title: 'Unamused', character: '😒' },
        { title: 'Winking', character: '😉' },  // 1f609
        { title: 'Cool', character: '😎' },  // 1F60E
        { title: 'Crying', character: '😢' },
        { title: 'Neutral', character: '😐' },  
        { title: 'Angry', character: '😠' },  
        { title: 'Wow', character: '😮' },  
        { title: 'Heart', character: '❤️' }, 
        { title: 'Fire', character: '🔥' },  
        { title: 'OK', character: '👌' },  // 1f44c
        { title: 'Thumbs up', character: '👍' },  // 1f44d
        { title: 'Clapping', character: '👏' },  // 1f44f
        { title: 'Celebrate', character: '🙌' },  // 1f64c
        { title: 'Praise', character: '🙏' },  // 1f64f
    ] );
}




