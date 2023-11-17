import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase';

// async function matchUser(username, password){    
    
// }

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { username, password } = credentials;


        try {
            var user = null;
            const q = query(collection(db, "DashboardUsers"), where("Username", "==", username));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                var data = doc.data()
                console.log(data.Password ,  password)
                if(data.Password === password){                    
                    user = data;
                    user.id = doc.id;
                }
            });
            console.log(user)

            if (!user) {
                return null;
            }

            return user;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks:{
    async signIn(user, account, profile) {
        return true;
    },
    async jwt(token, user, account, profile, isNewUser) {
      if (user) {
        token.user=user;        
      }
      return token;
    },
    async session(session, token) {
      console.log(token)
      return session;
    },
  },
  
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };