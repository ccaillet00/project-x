import type { LoginForm, AuthResponse, signUpForm } from '../types/auth'
import { useUser } from './userUser'
export const useAuth = () => {
    const config = useRuntimeConfig()
    const router = useRouter()
    const error = ref(null)
    const loading = useState<boolean>('auth-loading', () => false) 

    const login = async (formData: LoginForm) => {
        loading.value = true
        error.value = null

        try {
            const data = await $fetch<AuthResponse>(${config.public.apiBaseUrl}/api/auth/login, {
                method: 'POST',
                body: formData
            })

        const token = useCookie("token", {
            maxAge: formData.remember === 1 ? 60 * 60 * 24 * 30 : 60 * 60,
            secure: true,
            sameSite: "strict"
        })
        token.value = data.jwt

        const { loadUserFromToken } = useUser()
        loadUserFromToken()
        router.push('/dashboard')
        } catch (err: any) {
            error.value = err.data?.message || "Login fehlgeschlagen"
        } finally { 
            loading.value = false
        }
    }

    const signup = async (formData: signUpForm) => {
        loading.value = true
        error.value = null

        try {
            const data = await $fetch<any>(${config.public.apiBaseUrl}/api/auth/register, { // change type
                method: "POST",
                body: formData
            })

        const token = useCookie("token", {
            maxAge: 60 * 60,
            secure: true,
            sameSite: "strict"
        })
        token.value = data.jwt

        const { loadUserFromToken } = useUser()
        loadUserFromToken()

        router.push("/dashboard")
        } catch (err: any) {
            error.value = err.data?.message || "Registrierung fehlgeschlagen"
        } finally {
            loading.value = false
        }
    }

    const logout = () => {
        useCookie('token').value = null
        useState("user").value = null
        router.push("/")
    }
    return { login, signup, logout, error, loading}
}