import { createFetch } from "@vueuse/core";
import { useCookies } from "@vueuse/integrations/useCookies";

const cookies = useCookies(["csrftoken"]);

export const useAuthFetch = createFetch({
    options: {
        async beforeFetch({ options }) {
            options.headers = {
                ...options.headers,
                "X-CSRFToken": cookies.get("csrftoken"),
            };
            return { options };
        },
    },
    fetchOptions: {
        mode: "cors",
    },
});
