import React, { useState, useEffect, useCallback, useContext } from 'react';
import { 
    StyleSheet, Text, View, ScrollView, Pressable, ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { ThemeContext } from '@/context/ThemeContext';

type AnswerKey = 'a' | 'b' | 'c' | 'd';

interface ApiQuestions {
    id: number;
    question: string;
    possibleAnsers: string[];
    correctAnswer: string;
}

interface Answers {
    a: string;
    b: string;
    c: string;
    d: string;
}

interface QuizQuestion {
    _id: string;
    question: string;
    answers: Answers;
    correctAnswer: AnswerKey;
    correctAnswerText: string;
}

const QuizScreen = () => {
    const { theme } = useContext(ThemeContext);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<AnswerKey | null>(null);
    const [answerSubmitted, setAnswerSubmitted] = useState(false);

    const colors = {
        bg: theme === 'light' ? '#f0e6d2' : '#121212',
        card: theme === 'light' ? '#fff' : '#222',
        text: theme === 'light' ? '#333' : '#eee',
        fire: '#b22222',
        water: '#dfdfe0ff',
        correct: '#4CAF50',
        incorrect: '#FF5733',
        defaultBtn: theme === 'light' ? '#fffbfbff' : '#d1cfcfff',
        disabledBtn: '#aaaaaa',
        nextBtn: theme === 'light' ? '#333' : '#e0dadaff',
        nextText: theme === 'light' ? '#fff' : '#000',

        restartBtn: theme === 'light' ? '#fcfcffff' : '#d1cfcf',
restartText: theme === 'light' ? '#333' : '#000',
    };

    const fetchQuestions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('https://sampleapis.assimilate.be/avatar/questions');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const rawData: ApiQuestions[] = await response.json();

            const transformed: QuizQuestion[] = rawData.map(q => {
                const mapped: Answers = {
                    a: q.possibleAnsers[0] || '',
                    b: q.possibleAnsers[1] || '',
                    c: q.possibleAnsers[2] || '',
                    d: q.possibleAnsers[3] || '',
                };
                let correctKey: AnswerKey = 'a';
                for (const k of ['a','b','c','d'] as AnswerKey[]) {
                    if (mapped[k] === q.correctAnswer) correctKey = k;
                }
                return {
                    _id: String(q.id),
                    question: q.question,
                    answers: mapped,
                    correctAnswer: correctKey,
                    correctAnswerText: q.correctAnswer,
                };
            });

            const shuffled = transformed.sort(() => 0.5 - Math.random()).slice(0, 10);
            setQuestions(shuffled);
        } catch (err: any) {
            setError(`Fout bij het laden van vragen: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

    const handleAnswerPress = (key: AnswerKey) => {
        if (answerSubmitted) return;

        setSelectedAnswer(key);
        setAnswerSubmitted(true);

        const isCorrect = key === questions[currentQuestionIndex].correctAnswer;
        if (isCorrect) {
            setScore(prev => prev + 1);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    const handleNextQuestion = () => {
        const next = currentQuestionIndex + 1;
        if (next < questions.length) {
            setCurrentQuestionIndex(next);
            setSelectedAnswer(null);
            setAnswerSubmitted(false);
        } else {
            setQuizFinished(true);
            AsyncStorage.setItem('lastQuizScore', JSON.stringify({
                score,
                maxScore: questions.length,
                date: new Date().toISOString()
            })).catch(console.error);
        }
    };

    const getButtonColor = (key: AnswerKey) => {
        if (!answerSubmitted) return colors.defaultBtn;
        const current = questions[currentQuestionIndex];
        if (key === current.correctAnswer) return colors.correct;
        if (key === selectedAnswer && key !== current.correctAnswer) return colors.incorrect;
        return colors.defaultBtn;
    };

    if (loading) return (
        <View style={[styles.container, styles.center, { backgroundColor: colors.bg }]}>
            <ActivityIndicator size="large" color={colors.fire} />
            <Text style={{ color: colors.text, marginTop: 10 }}>Loading Quiz Questions...</Text>
        </View>
    );

    if (error || questions.length === 0) return (
        <View style={[styles.container, styles.center, { backgroundColor: colors.bg }]}>
            <Text style={{ color: colors.text, textAlign: 'center' }}>{error || "Geen quizvragen gevonden."}</Text>
            <Pressable style={[styles.retryButton, { backgroundColor: colors.fire }]} onPress={fetchQuestions}>
                <Text style={{ color: colors.defaultBtn, fontWeight: 'bold' }}>Probeer Opnieuw</Text>
            </Pressable>
        </View>
    );

    if (quizFinished) {
        let message = score < 5 ? 'Je bent verloren! Probeer het opnieuw!' : score <= 7 ? 'Goed gedaan! Voldoende.' : 'Fantastisch! Je bent een echte Avatar kenner!';
        return (
            <View style={[styles.container, styles.center, { backgroundColor: colors.bg }]}>
                <Text style={[styles.headerText, { color: colors.text }]}>Quiz Afgerond!</Text>
                <Text style={[styles.finalScore, { color: colors.fire }]}>{score} / {questions.length}</Text>
                <Text style={[styles.messageText, { color: colors.text }]}>{message}</Text>
      <Pressable 
    style={[styles.retryButton, { backgroundColor: colors.restartBtn, borderColor: '#b22222' ,borderWidth:2}]}
    onPress={() => {
        setQuizFinished(false);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setAnswerSubmitted(false);
        setScore(0);
    }}
>
    <Text style={{ color: colors.restartText, fontWeight: 'bold' }}>
        Nieuwe Quiz Starten
    </Text>
</Pressable>

            </View>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.headerText, { color: colors.text }]}>Avatar Knowledge Quiz</Text>
                <View style={styles.infoBar}>
                    <Text style={{ color: colors.text }}>Score: {score}</Text>
                    <Text style={{ color: colors.text }}>Vraag {currentQuestionIndex + 1} / {questions.length}</Text>
                </View>

                <View style={[styles.questionCard, { backgroundColor: colors.card, borderColor: colors.fire }]}>
                    <Text style={[styles.questionText, { color: colors.text }]}>{currentQuestion.question}</Text>
                </View>

                {(['a','b','c','d'] as AnswerKey[]).map(key => {
                    const text = currentQuestion.answers[key];
                    if (!text) return null;
                    const btnColor = getButtonColor(key);
                    return (
                        <Pressable
                            key={key}
                            style={[styles.answerButton, { backgroundColor: btnColor, borderColor: '#b22222' }]}
                            onPress={() => handleAnswerPress(key)}
                            disabled={answerSubmitted}
                        >
                            <Text style={{ color: btnColor !== colors.defaultBtn ? colors.defaultBtn : '#333', fontWeight: '600' }}>{key.toUpperCase()}. {text}</Text>
                        </Pressable>
                    );
                })}

                {answerSubmitted && (
          <Pressable 
    style={[styles.nextButton, { backgroundColor: colors.nextBtn }]} 
    onPress={handleNextQuestion}
>
    <Text style={{ color: colors.nextText, fontWeight: 'bold' }}>
        Volgende Vraag ➤
    </Text>
</Pressable>

                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 50 },
    scrollContent: { paddingHorizontal: 15, paddingBottom: 40 },
    center: { justifyContent: 'center', alignItems: 'center' },
    headerText: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    infoBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, paddingHorizontal: 5 },
    questionCard: { borderRadius: 12, padding: 20, marginBottom: 25, borderWidth: 2, elevation: 5 },
    questionText: { fontSize: 18, fontWeight: '700' },
    answerButton: { padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1.5 },
    nextButton: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    retryButton: { padding: 12, borderRadius: 8, marginTop: 20, alignItems: 'center' },
    finalScore: { fontSize: 48, fontWeight: '900', marginBottom: 20, textAlign: 'center' },
    messageText: { fontSize: 18, textAlign: 'center', marginBottom: 20 },
});

export default QuizScreen;
