
// see: https://unicode-table.com/en/sets/emoji/
// use Meta-x insert-char

export default function SpecialCharactersEmoji( editor ) {
    editor.plugins.get( 'SpecialCharacters' ).addItems( 'Emoji', [
        { title: 'Smiling', character: '😀' },  // 1F600
        { title: 'Laughing', character: '😂' },  // 1F602
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




