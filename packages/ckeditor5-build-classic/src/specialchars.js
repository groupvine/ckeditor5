
// see: https://unicode-table.com/en/sets/emoji/
// use Meta-x insert-char

export function SpecialCharactersGVMath( editor ) {
    let specCharsPlugin = editor.plugins.get( 'SpecialCharacters' );

    specCharsPlugin.addItems( 'Math', [
	{ character: '<', title: 'Less-than sign' },
	{ character: '>', title: 'Greater-than sign' },
	{ character: '≤', title: 'Less-than or equal to' },
	{ character: '≥', title: 'Greater-than or equal to' },
	{ character: '±', title: 'Plus-minus sign' },
	{ character: '÷', title: 'Division sign' },
	{ character: '×', title: 'Multiplication sign' },
	{ character: '∑', title: 'N-ary summation' },
	{ character: '∞', title: 'Infinity' },
	{ character: '√', title: 'Square root' },
	{ character: '≠', title: 'Not equal to' },
	{ character: '∈', title: 'Element of' },
	{ character: '∉', title: 'Not an element of' },
	{ character: '∋', title: 'Contains as member' },
	{ character: '∏', title: 'N-ary product' },
	// { character: '∧', title: 'Logical and' },
	// { character: '∨', title: 'Logical or' },
	{ character: '∩', title: 'Intersection' },
	{ character: '∪', title: 'Union' },
	{ character: '¼', title: 'Vulgar fraction one quarter' },
	{ character: '½', title: 'Vulgar fraction one half' },
	{ character: '¾', title: 'Vulgar fraction three quarters' }
    ] );
}

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
	{ character: '–', title: 'En dash' },
	{ character: '—', title: 'Em dash' },
	{ character: '°', title: 'Degree sign' },
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




