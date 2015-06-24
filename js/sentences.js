var Sentences = function() {
    this._meta = []
    this.listOfSongs = [];
    this.sentence = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
};

Sentences.prototype.getSentence = function() {
    var sentences = this.sentencesArray.sentenses;
    var random = Math.floor(Math.random() * sentences.length)
    console.log(random)
    this.sentence = sentences[random]
    return this;
}

Sentences.prototype.getMetaData = function(sentence) {
    sentence = sentence || this.sentence;
    // add each letter as a span with it's own id
    if (sentence && sentence.length > 0) {
        // get the words for typos issue
        var words = sentence.split(/\s/g);

        // loop the words
        var count = 0;
        for (var i = 0; i < words.length; i++) {
            // create it's class
            var word = words[i];

            //now loop thru the word itsle
            for (var x = 0; x < word.length; x++) {
                // console.log(sentence[x]);
                this._meta.push({
                    word: word,
                    letter: word[x],
                    letter_position: count,
                    dom_position: 'position-' + count,
                    isLetter: true
                });
                count++;
            }

            this._meta.push({
                word: "space",
                letter: " ",
                letter_position: count,
                dom_position: 'position-' + count,
                isLetter: false
            });
            count++;
        }

        // Remove the last value, it's also a space
        this._meta.pop();
    }

    return this
}

Sentences.prototype.populateToDOM = function(elem) {
    this.elem = elem || document;

    if (this._meta.length > 0) {
        // Empty the guide text
        $(elem).empty();

        for (var i = 0; i < this._meta.length; i++) {
            var letter = this._meta[i];
            if (letter.isLetter) {
                $(elem).append('<span data-word="' + letter.word + '" data-letter-position="' + letter.letter_position + '" id="' + letter.dom_position + '">' + letter.letter + "</span>");
            }
            // If it's a space value
            else {
                // add the spaces space
                $(elem).append('<span data-word="space" data-letter-position="0" id="' + letter.dom_position + '"> </span>');
            }
        }
    }

    return this;
}

Sentences.prototype.sentencesArray = {
    "sentenses": [
        "People are terrified of change, failure and taking risks. This is one of the main reasons people settle in life. It's not about unrealistic goals or perfection. It is about changing the things you can to be happy, not simply drifting along in life and complaining. It is far easier to settle than it is to leave our comfort zone. We create endless excuses to justify our complacency and all that it will result in is our looking back with regret and a slightly bruised ego, wishing we hadn't settled. We settle in our relationships too because we are scared to be alone and lose the stability a relationship offers. Fear paralyzes people and holds them back. Many people suffer with tremendous amounts of self-doubt and are unable to believe they are good enough. There are always better options out there, but too many people have low self-esteem, which prevents them from realizing this. It's better to be alone than it is to want to be alone.",

        "As technology evolves, our levels of patience have been dwindling. We lack fortitude as a society and unfortunately make the mistake of choosing the first option presented to us. Some people are tired of dating or being alone, so they pick up the first person that says the right thing. It takes time, effort and patience to find the right person. This also applies to life goals such as embarking on a new career path. Things worth having take a lot of time and effort, which many people do not want to exert either. Although something may not be what someone really wants, it is likely that it has become a habit and it's more comfortable to maintain the status quo than to challenge themselves.",

        "Mediocrity is a place where people often get stuck and do not know how to escape. This is a mindset that can only be changed with mind renewal. In order to move from this place, one must think differently, get rid of what hasn't worked, connect with those who can give sound direction, design a plan of action and put that plan in motion. Life is way too short to settle for anything less than what we truly want. The only way to embrace your potential is to stop settling. We are only limiting ourselves and wasting our precious time. The moment we begin to settle in the most important roles of our lives is the moment we begin to die a slow death. Excellence is a place where people who refuse to settle for mediocrity live; it is where one reaps from all the hard work sown. It is a journey of continuous progression toward the goals in your life.",

        "When we were young, we wanted nothing more than to be a 'big kid.' We wanted all of the perks that came along with growing up, like being able to do whatever we pleased, not being told what to do, reaching that long-awaited age when we could finally taste alcohol freely, etc. We wanted to grow up faster because we had our eyes on the prize. Little did we know, along with growing up came responsibility - a sh*t ton of it - that we would rather not be burdened with, emotional turmoil from the turnover of relationships, loss that we finally understand, jobs that we hate, etc. As young-minded, naive youths, we barely experienced an ounce of negativity more significant than Mama getting angry, or our older siblings excluding us from their exclusive 'Ace of Base Club' (this was a devastating reality for me).",

        "Many of us don' t like to say no to a coworker or a boss — for instance, when the boss asks for a tighter deadline, or a team member needs a longer one — because we' re worried about damaging the relationship.That' s because it often feels synonymous with confrontation. And whether you are conflict - averse or conflict - ready, your counterpart may not always handle hearing no the way you' d hoped. Some counterparts will totry to\" yes the no, \"even when you' re hoping for minimal friction, because they have learned early on not to take no for an answer and feel like pushovers if they do. Or he might get angry, push back, or go silent, because that's how he always handles hearing no one.",

        "It's amazing what a human being can accomplish, the power that lies within us all. Interestingly enough, not many of us acknowledge that power - or perhaps many just never figure out how to tap into it. Not so long ago, I had a brief conversation with a colleague of mine that really piqued my interest: He asserted his belief that since God dwells in each person and since we are all created in his image, we are all somehow semi-gods. Though I don't intend for this article to ignite a spiritual debate, when he said that, I felt a longing that made me explore the idea for further consideration. To accomplish any goal, one must remain focused. We've seen this concept emphasized in many anecdotes throughout time — beginning with biblical characters, moving on to fables relayed to us by our parents and finally, in common stories amongst our peers.",

        "Fear is a paralyzing element — one of the most difficult concepts to evade. Ideas are lost, movements are immobilized and perseverance is crushed. It took me a long time to realize that this was a lot of the problem. The truth is, you can't be afraid to fail in the search of perfection. You miss all of the shots that you do not take. Maybe you' ve seen someone try and fail, but are you going to base what you are off what someone else isn' t ? We are all connected, so when someone else succeeds, we all share in it.Take pride. Whatever goal you intend to pursue will take time, patience, faith and most importantly, work.",

        "A lot of what attaining a particular requires is focus. It has been proven that many of our predecessors had to be isolated from the crowd to reach their personal pinnacle of achievement. Look around you: much of what you see has the potential to distract you. For this reason, solitude is often paramount for the growth that is necessary for a person to evolve. So, separate from the crowd and amass a wealth of knowledge, independence and understanding about yourself and the world around you. Perhaps, when you return to civilization, you will have forgotten the person you once were. Though you can never forget what you've done, you can adapt and carry on. Be rare.",

        "The Great Demon War... Long ago, after this conflict ended, the power of \"Magic\" simply vanished. 1,000 years have passed... With iron, gunpowder, and steam engines, people have used machinery to revive the world. But now, the legendary power of \"Magic\" has been revived secretly, and a group has risen that intends to control the world with this power. Is mankind on the verge of repeating a terrible mistake... ?",

        "Mr. Heathcliff was there - laid on his back. His eyes met mine so keen and fierce, I started; and then he seemed to smile. I could not think him dead: but his face and throat were washed with rain; the bed-clothes dripped, and he was perfectly still. The lattice, flapping to and fro, had grazed one hand that rested on the sill; no blood trickled from the broken skin, and when I put my fingers to it, I could doubt no more; he was dead and stark!",

        "Hello ladies and gentlemen. My name is Aurora Borealis. There are over 400 stars in our galaxy, maybe more. No one knows for sure. Many have said that the universe is even larger than the Indian Ocean. And that is why it is called \"Infinitum Star-Octo-Pusium.\" Ah, yes: Our glorious constellations. There they all are. Take a look. Over here we have one with a guy... holding some sort of thing. Over here, our beloved Olympic rings; all seven of them. And here... here's one with a fish.",

        "What's the meaning of life... Who has not posed this question to themselves at some point in their lives? Are there any? If you happen to think, then chances are you have. Not once. Not even twice. And, sadly, despite so many of us having, there has never been a satisfactory answer given. There are some half-answers, quasi-answers, answers that pretend to be true. But this question will be haunting all of as until the last day of our lives."
    ]
}
